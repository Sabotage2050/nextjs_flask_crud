export type  TestItem = Pick<TestItemResponse, "text" | "updated_at" | "created_at" | 'id'>

export interface TestItemResponse {
    id: number | undefined,
    text: string,
    updated_at: any,
    created_at: any
}