
import { BaseSubscreen, ModSdkManager, getText, layout, SettingsModel, modStorage, deepLibLogger } from '../deeplib';
import { advElement, Modal } from '../utilities/elements/elements';

/**
 * Configuration options for the {@link GuiImportExport} class.
 */
export type ImportExportOptions = {
  /** 
   * A custom save file extension (e.g., ".mydata"). 
   * If it doesn't start with a dot, it will be automatically prefixed.
   */
  customFileExtension: string;

  /** Optional callback invoked after data has been successfully imported. */
  onImport?: () => void;

  /** Optional callback invoked after data has been successfully exported. */
  onExport?: () => void;
};

/**
 * Possible data transfer methods for import/export operations.
 * - `clipboard`: Uses the system clipboard.
 * - `file`: Uses file save/load dialogs.
 */
type DataTransferMethod = 'clipboard' | 'file';

/**
 * GUI screen for importing and exporting mod data.
 * Provides buttons to import/export data either via file or clipboard.
 */
export class GuiImportExport extends BaseSubscreen {
  private importExportOptions: ImportExportOptions;

  get name(): string {
    return 'import-export';
  }

  constructor(importExportOptions: ImportExportOptions) {
    super({ drawCharacter: true });
    this.importExportOptions = importExportOptions;
  }

  load(): void {

    super.load();

    const importFromFileButton = advElement.createButton({
      id: 'deeplib-import-file-button',
      size: [600, 90],
      image: `${PUBLIC_URL}/dl_images/file_import.svg`,
      onClick: () => {
        this.dataImport('file');
      },
      label: getText('import-export.button.import_file')
    });
    layout.appendToSettingsDiv(importFromFileButton);

    const exportToFileButton = advElement.createButton({
      id: 'deeplib-export-file-button',
      size: [600, 90],
      image: `${PUBLIC_URL}/dl_images/file_export.svg`,
      onClick: () => {
        this.dataExport('file');
      },
      label: getText('import-export.button.export_file')
    });
    layout.appendToSettingsDiv(exportToFileButton);

    const importFromClipboardButton = advElement.createButton({
      id: 'deeplib-import-clipboard-button',
      size: [600, 90],
      image: `${PUBLIC_URL}/dl_images/clipboard_import.svg`,
      onClick: () => {
        this.dataImport('clipboard');
      },
      label: getText('import-export.button.import_clipboard')
    });
    layout.appendToSettingsDiv(importFromClipboardButton);

    const exportToClipboardButton = advElement.createButton({
      id: 'deeplib-export-clipboard-button',
      size: [600, 90],
      image: `${PUBLIC_URL}/dl_images/clipboard_export.svg`,
      onClick: () => {
        this.dataExport('clipboard');
      },
      label: getText('import-export.button.export_clipboard')
    });
    layout.appendToSettingsDiv(exportToClipboardButton);
  }

  resize(): void {
    super.resize();
  }

  /** Exports the mod data using the specified method. */
  async dataExport(transferMethod: DataTransferMethod) {
    try {
      const data = LZString.compressToBase64(JSON.stringify(modStorage.playerStorage));

      if (transferMethod === 'clipboard') {
        await this.exportToClipboard(data);
      } else if (transferMethod === 'file') {
        await this.exportToFile(data, 'themed_settings');
      }

      this.importExportOptions.onExport?.();
      ToastManager.success('Data exported successfully.');
    } catch (error) {
      ToastManager.error('Data export failed.');
      deepLibLogger.error(`Data export failed for ${ModSdkManager.ModInfo.name}.`, error,);
    }
  }

  /** Imports mod data using the specified method. */
  async dataImport(transferMethod: DataTransferMethod) {
    try {
      let importedData: string | null = '';

      if (transferMethod === 'clipboard') {
        importedData = await this.importFromClipboard() ?? null;
      } else if (transferMethod === 'file') {
        importedData = await this.importFromFile() ?? null;
      }

      if (!importedData) {
        throw new Error('No data imported.');
      }

      const data = JSON.parse(LZString.decompressFromBase64(importedData) ?? '') as SettingsModel;

      if (!data) {
        throw new Error('Invalid data.');
      }

      modStorage.playerStorage = data;
      this.importExportOptions.onImport?.();
      ToastManager.success('Data imported successfully.');
    } catch (error) {
      ToastManager.error('Data import failed.');
      deepLibLogger.error(`Data import failed for ${ModSdkManager.ModInfo.name}.`, error,);
    }
  }

  /** Saves data to a file using the browser's save dialog. */
  async exportToFile(data: string, defaultFileName: string): Promise<void> {
    const CUSTOM_EXTENSION = this.importExportOptions.customFileExtension.startsWith('.')
      ? this.importExportOptions.customFileExtension
      : '.' + this.importExportOptions.customFileExtension;

    const suggestedName = defaultFileName.endsWith(CUSTOM_EXTENSION)
      ? defaultFileName
      : defaultFileName + CUSTOM_EXTENSION;

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: suggestedName,
          types: [
            {
              description: 'Custom Data Files',
              accept: { 'text/plain': [CUSTOM_EXTENSION] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
      } catch (error: any) {
        throw new Error('File save cancelled or failed: ' + error.message);
      }
    } else {
      const fileName = await Modal.prompt('Enter file name', suggestedName);

      if (fileName === null) {
        return;
      } else if (fileName === '') {
        throw new Error('File name cannot be empty.');
      }

      const blob = new Blob([data], { type: 'text/plain' });
      const link = ElementCreate({
        tag: 'a',
        attributes: {
          href: URL.createObjectURL(blob),
          download: fileName.endsWith(CUSTOM_EXTENSION) ? fileName : fileName + CUSTOM_EXTENSION
        },
      });

      link.click();
      URL.revokeObjectURL(link.href);
    }
  }

  /** Opens a file picker and reads the selected file's contents, importing the data. */
  async importFromFile(): Promise<string | null> {
    const CUSTOM_EXTENSION = this.importExportOptions.customFileExtension.startsWith('.')
      ? this.importExportOptions.customFileExtension
      : '.' + this.importExportOptions.customFileExtension;

    async function importFromFileInternal(file: File): Promise<string | null> {
      if (!file.name.endsWith(CUSTOM_EXTENSION)) {
        throw new Error(`Invalid file type. Expected a ${CUSTOM_EXTENSION} file.`);
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
      });
    }

    if ('showOpenFilePicker' in window) {
      try {
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Custom Data Files',
              accept: { 'text/plain': [CUSTOM_EXTENSION] },
            },
          ],
          multiple: false,
        });
        const file = await fileHandle.getFile();
        return await importFromFileInternal(file);
      } catch (error: any) {
        throw new Error('File selection cancelled or failed: ' + error.message);
      }
    } else {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = CUSTOM_EXTENSION;
        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            try {
              const data = await importFromFileInternal(file);
              resolve(data);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('No file selected.'));
          }
        };
        input.click();
      });
    }
  }

  /** Copies the given data to the clipboard. */
  async exportToClipboard(data: string): Promise<void> {
    return navigator.clipboard.writeText(data).catch((error) => {
      throw new Error('Failed to copy data to clipboard.' + error);
    });
  }

  /** Prompts the user to enter data and returns it. */
  async importFromClipboard(): Promise<string | null> {
    return Modal.prompt('Enter data to import').catch((error) => {
      throw new Error('Failed to read data from clipboard.' + error);
    });
  }
}
