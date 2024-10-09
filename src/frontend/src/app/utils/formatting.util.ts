export class FormattingUtil {
    static formatString(rawString: string): string {
        return rawString
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    }
    static undoFormatString(formattedString: string): string {
        return formattedString
            .toUpperCase()
            .replace(/ /g, '_');
    }
    static extractNumericAndUnit(value: string): { numericValue: string, unit: string } {
        const regex = /^(\d+)([a-zA-Z]+)$/;
        const match = value.match(regex);

        if (match) {
            return {
            numericValue: match[1],
            unit: match[2]
            };
        } else {
            return { numericValue: '', unit: '' };
        }
    }
}
