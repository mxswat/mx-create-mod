import * as ejs from 'ejs';
export interface TemplateOptions {
    modName: string,
    modNameSafe: string,
}

// const FileOrDirectorySeparator = '__'

const illegalChars = /[\/\?<>\\:\*\|"]/g; // illegal Characters https://kb.acronis.com/content/39790
/** Based on https://stackoverflow.com/a/37511463/10300983 */
export function sanitize(originalText: string): string {
    return originalText.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(illegalChars, '')
}

/** Based on https://stackoverflow.com/a/37511463/10300983 */
export function toPascalCase(str: string): string {
    return str
        .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substring(1).toLowerCase())
        .replace(/\s+/g, '')
}

/**
 * Checks if directory/file name has __ (double _)
 * @param name 
 * @returns 
 */
export function isFileOrDirectoryToRename(name: string) {
    return name.indexOf('__') > -1
}

export function generateFileOrDirectoryNameForEJS(name: string, options: TemplateOptions) {
    return name.replace(/__(.*?)__/g, (match, p1) => options[p1]);
}

export function renderTemplate(content: string, data: TemplateOptions) {
    return ejs.render(content, data);
}