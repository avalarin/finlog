export interface IUseCase<Req, Res> {
    do(req: Req): Promise<Res>
}
