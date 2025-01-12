import FlowOkrMap from "@/components/map/FlowOkrMap";

export default function MapPage() {

    return (
        <div className='flex flex-col gap-8 w-full h-full'>
            <h1>Map Page</h1>
            <div className='w-full h-full items-center justify-center'>
                <FlowOkrMap />
            </div>
        </div>
    )
}