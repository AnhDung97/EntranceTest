export interface ScreenInterface {
    data: ScreenDetailsInterface[]
}
export interface ScreenDetailsInterface {
    id: number,
    backgroundUrl: string,
    hitzone: number[],
    addressId: number[]
}