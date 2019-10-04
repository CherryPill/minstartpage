describe("getDaysAgoWithinMonthTest", () => {
    let dateNow;
    beforeEach(() => {
            dateNow = new Date();
        }
    );
    it("should return 1 day difference when within one month", () => {
        const dateThen = new Date(dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 1);
        const expectedDiff = 1;
        expect(getDaysAgoWithinMonth(dateThen)).toBe(expectedDiff);
    });
    it("should return fixed value of 2 if it is month carryover", () => {
        const dateThen = new Date(dateNow.getFullYear(),
            dateNow.getMonth() - 1,
            dateNow.getDate());
        expect(getDaysAgoWithinMonth(dateThen)).toBe(2);
    });
});
describe("getOffsetTest", () => {
    let mockElement;
    beforeAll(() => {
        mockElement = document.createElement("div")
    });
    it("should return non-null object if element is present", () => {
        expect(getOffset(mockElement)).toEqual(jasmine.any(Object));
    });
    it("should return error if element null or undefined", () => {
        expect(getOffset(null)).toBe(internalErrors.DOM_ELEMENT_NOT_FOUND)
    });
});