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
    const base = `//${tag}[contains(normalize-space(.),'${text}')]`;
    return index !== undefined ? `(${base})[${index}]` : base;
  }

  static containsText(text: string, index?: number) {
    const base = `//*[contains(normalize-space(.),'${text}')]`;
    return index !== undefined ? `(${base})[${index}]` : base;
  }

  // contains with default xpath tag 
    static byAttribute(tag: string, attribute: string, value: string, index?: number) {
  const base = `//${tag}[@${attribute}='${value}']`;
  return index !== undefined ? `(${base})[${index}]` : base;
}
//with class as attribute
static byClass(tag: string, className: string, index?: number) {
  const base = `//${tag}[contains(@class, '${className}')]`;
  return index !== undefined ? `(${base})[${index}]` : base;
}
//li tag with normalized text
static exactTextNormalized(tag: string, text: string, index?: number) {
  const base = `//${tag}[normalize-space(text())='${text}']`;
  return index !== undefined ? `(${base})[${index}]` : base;
}
static ticketCard(ticketName: string) {
  return `//div[contains(@class,'MuiCardContent-root') and 
          contains(translate(normalize-space(.),
          'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
          '${ticketName.toUpperCase()}')]`;
}

  }
