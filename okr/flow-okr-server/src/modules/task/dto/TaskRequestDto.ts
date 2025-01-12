export interface AddTaskRequestDto {
    title: string;
    content: string;
    rate: number;
    type: string;
    parentId: number | null;
}