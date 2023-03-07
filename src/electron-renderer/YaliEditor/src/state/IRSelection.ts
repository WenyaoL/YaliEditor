/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 * @since 2023/2/14
 */

interface IRPosition {
    startMid: string,
    startOffset: number,
    endMid: string,
    endOffset: number
}

interface IRMark {
    bookMark: any;
    secondBookMark: any;
}

class IRSelectionRange {

    public position: IRPosition
    public mark: IRMark

    constructor(position: IRPosition, mark: IRMark) {
        this.position = position
        this.mark = mark
    }
}

export default IRSelectionRange