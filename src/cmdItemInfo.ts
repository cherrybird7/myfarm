export interface CmdItemInfo {
  name: string;
  help: string;
  allowDelegate?: boolean;
  solve: (ctx: seal.MsgContext, msg: seal.Message, cmdArgs: seal.CmdArgs) => seal.CmdExecuteResult;
}
