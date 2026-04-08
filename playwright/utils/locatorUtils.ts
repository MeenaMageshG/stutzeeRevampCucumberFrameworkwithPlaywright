export class LocatorUtils {
  static byTestId(id: string) {
    return `[data-testid='${id}']`;
  }
 
  static byName(name: string) {
    return `[name='${name}']`;
  }
  static ID(name: string) {
    return `[id='${name}']`;
  }
  //  contains text with optional index
  static containsTextIn(tag: string, text: string, index?: number) {
    const base = `//${tag}[contains(text(),'${text}')]`;
    return index !== undefined ? `(${base})[${index}]` : base;
  }
  // contains with default xpath tag 
    static byAttribute(tag: string, attribute: string, value: string) {
    return `//${tag}[@${attribute}='${value}']`;
  }
}