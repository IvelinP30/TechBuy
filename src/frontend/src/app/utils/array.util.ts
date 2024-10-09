export class ArrayUtil {
    static removeDuplicates<T>(array: T[]): T[] {
        return Array.from(new Set(array));
    }

    static filter(options: string[], value: string): string[] {
        if (!value) {
            return [];
        }

        const filterValue = value.toLowerCase();

        const startsWithMatches = options.filter(option => option.toLowerCase().startsWith(filterValue));
        const containsMatches = options.filter(option => 
            option.toLowerCase().includes(filterValue) && !option.toLowerCase().startsWith(filterValue)
        );
        return [...startsWithMatches, ...containsMatches];
    }
    
    static getPropertyValue(properties: any[], propertyId: string): string {
        const property = properties.find(prop => prop.id === propertyId);
        return property ? property.value : '';
    }
}
  
