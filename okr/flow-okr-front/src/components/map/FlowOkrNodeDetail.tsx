import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";
import {getTaskDetailById} from "@/api/task/task-api";
import {TaskDetailResponseDto} from "@/api/dto/task.response.dto";
import {Textarea} from "@/components/ui/textarea";
import {TextSearchIcon, WatchIcon} from "lucide-react";

interface FlowOkrNodeDetailProps {
    title: string;
    content: string;
    id: number;
}

export default function FlowOkrNodeDetail({title, content, id}: FlowOkrNodeDetailProps) {

    const [taskDetail, setTaskDetail] = useState<TaskDetailResponseDto>()

    useEffect(() => {
        getTaskDetailById(id).then(response => {
            setTaskDetail(response);
        })
    },[id])

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="icon" className="bg-gray-200 hover:bg-gray-300 text-black">
                        <TextSearchIcon className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{content}</DialogDescription>
                    </DialogHeader>
                    {taskDetail &&
                        <div className="flex flex-col gap-6 py-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="goal" className="font-medium">
                                    과제 목표 소개
                                </Label>
                                <pre
                                    id="goal"
                                    className="bg-gray-100 p-4 rounded-md text-gray-900 whitespace-pre-wrap"
                                >
                                  {taskDetail.goal}
                                </pre>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="requirement" className="font-medium">
                                    필요 역량/경력
                                </Label>
                                <pre
                                    id="requirement"
                                    className="bg-gray-100 p-4 rounded-md text-gray-900 whitespace-pre-wrap"
                                >
                                  {taskDetail.requirement}
                                </pre>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="achievement" className="font-medium">
                                    핵심 결과
                                </Label>
                                <pre
                                    id="achievement"
                                    className="bg-gray-100 p-4 rounded-md text-gray-900 whitespace-pre-wrap"
                                >
                                  {taskDetail.achievement}
                                </pre>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="actionplan" className="font-medium">
                                    액션 플랜
                                </Label>
                                <pre
                                    id="actionplan"
                                    className="bg-gray-100 p-4 rounded-md text-gray-900 whitespace-pre-wrap"
                                >
                                  {taskDetail.action_plan}
                                </pre>
                            </div>
                        </div>

                    }
                    <DialogFooter>
                        <Button type="submit">관심 과제 등록</Button>
                        <Button type="submit">수정</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
};