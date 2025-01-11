export interface AddTaskRequestDto {
    content: string;
    parentId: number | null;
}