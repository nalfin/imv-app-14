const CardEvent = ({ summary }: { summary: any }) => {
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-4 lg:grid-rows-1">
            <div className="bg-card text-card-foreground col-span-2 flex flex-col gap-3 rounded-md border p-6 shadow-sm lg:col-span-1">
                <p className="text-muted-foreground text-sm">Jumlah Peserta</p>
                <p className="text-2xl font-semibold">{summary?.total ?? 0}</p>
            </div>
            <div className="bg-card text-card-foreground col-span-2 flex flex-col gap-3 rounded-md border p-6 shadow-sm lg:col-span-1">
                <p className="text-muted-foreground text-sm">
                    Jumlah HQ Tercapai (27)
                </p>
                <p className="text-2xl font-semibold">
                    {summary?.totalHQ27 ?? 0}
                </p>
            </div>
            <div className="bg-card text-card-foreground col-span-2 flex flex-col gap-3 rounded-md border p-6 shadow-sm lg:col-span-1">
                <p className="text-muted-foreground text-sm">
                    Jumlah Qualified
                </p>
                <p className="text-2xl font-semibold">
                    {summary?.qualified ?? 0}
                </p>
            </div>
            <div className="bg-card text-card-foreground col-span-2 flex flex-col gap-3 rounded-md border p-6 shadow-sm lg:col-span-1">
                <p className="text-muted-foreground text-sm">
                    Jumlah Unqualified
                </p>
                <p className="text-2xl font-semibold">
                    {summary?.unqualified ?? 0}
                </p>
            </div>
        </div>
    )
}

export default CardEvent
