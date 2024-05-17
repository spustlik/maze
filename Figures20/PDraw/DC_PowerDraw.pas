unit DC_PowerDraw;

interface
uses
  Windows, Classes, SysUtils, inifiles,
  MContext, MObjects, MScene, MTrans, MBitmaps, ptutils,
  PowerD3D,
  DirectXGraphics, AGFUnit, VTDUnit;
type
  TPDDrawContext_RT = class(TDrawContext)
  private
    FImages:TStringList;
    function GetXTrans: TISOTrans;
    function GetImage(aName: string): TAGFImage;
    function GetImages(aIndex: integer): TAGFImage;
  public
    constructor Create;
    procedure Load(VTDb:TVTDb);
    function GetBmp(BmpId:TBmpId):Integer;virtual;
    procedure DrawBmp(w:TWPoint; dx,dy:Integer; BmpId: TBmpId; Frame: Integer);override;
    procedure BlitBmp(dest,src,size:TPoint; BmpId: TBmpId; Frame: Integer);override;
    procedure Text(Position:TPoint;Text:string;Center:Boolean=False;Font:TFontID=DEFAULT_FONT);override;
    function TextSize(Text:string;Font:TFontID=DEFAULT_FONT):TPoint;override;
    property XTrans:TISOTrans read GetXTrans;
    property Images[aIndex:integer]:TAGFImage read GetImages;
    property Image[aName:string]:TAGFImage read GetImage;
  end;

  TPDDrawContext_Design=class(TPDDrawContext_RT)
    FMapping:TStringList;
    constructor Create;
    procedure LoadFromIni(aFileName:string);
    function GetBmp(BmpId:TBmpId):Integer;override;
  private
    function GetBmpIDIndex(BmpId: TBmpId): Integer;
  end;

  TPDInputContext = class(TInputContext)
  private
    FMousePos:TPoint;
    FWMousePos:TWPoint;
    FDC:TDrawContext;
  public
    constructor Create(aDC:TDrawContext);
    function GetMousePos:TPoint;override;
    function GetWMousePos(z:Integer):TWPoint;override;
    function GetGroundMousePos:TWPoint;override;
    function GetKey(Key:Integer):Boolean;override;
    procedure SetMouseCursor(cur:Integer);override;
    function SetupInputs:Boolean;
  end;

  {$IFDEF RUNTIME}
  TPDDrawContext=class(TPDDrawContext_RT);
  {$ELSE}
  TPDDrawContext=class(TPDDrawContext_Design);
  {$ENDIF}

type
  TErrCallFunc = function (err:Integer):string of object;
procedure CheckError(err:Integer;CallFunc:TErrCallFunc);

implementation
uses fMain;

procedure CheckError(err:Integer;CallFunc:TErrCallFunc);
begin
  if err<>0 then
    raise Exception.Create(CallFunc(err));
end;

{ TPDDrawContext_RT }

procedure TPDDrawContext_RT.BlitBmp(dest, src, size: TPoint; BmpId: TBmpId;
  Frame: Integer);
begin
  //hlavne gui
end;

constructor TPDDrawContext_RT.Create;
begin
  inherited;
  Trans:=TISOTrans.Create;
  XTrans.Pos.x:=450;
  XTrans.Pos.y:=-200;
  XTrans.TW:=50;//45;
  XTrans.TH:=30;//26;
  XTrans.TE:=50;
  XTrans.TW:=47;//45;
  XTrans.TH:=28;//26;
  XTrans.TE:=50;

{  XTrans.TW:=45;
  XTrans.TH:=27;
  XTrans.TE:=50;}
  FImages:=TStringList.Create;
end;

procedure TPDDrawContext_RT.DrawBmp(w: TWPoint; dx, dy: Integer;
  BmpId: TBmpId; Frame: Integer);
var
  p:TPoint;
begin
  p:=Trans.WorldToScreen(w);
  dx:=dx+p.x;
  dy:=dy+p.y;
  FormMain.PowerGraph.RenderEffectCol( Images[GetBmp(BmpId)],dx,dy,$7FFFFFFF,Frame,effectSrcAlpha);
end;

function TPDDrawContext_RT.GetBmp(BmpId: TBmpId): Integer;
begin
  Result:=BmpId;
end;

function TPDDrawContext_RT.GetImage(aName: string): TAGFImage;
begin
  Result:=Images[FImages.IndexOf(aName)];
end;

function TPDDrawContext_RT.GetImages(aIndex: integer): TAGFImage;
begin
  Result:=FImages.Objects[aIndex] as TAGFImage;
end;

function TPDDrawContext_RT.GetXTrans: TISOTrans;
begin
  Result:=Trans as TISOTrans;
end;

procedure TPDDrawContext_RT.Load(VTDb: TVTDb);
const
//  FMT_ALPHA=D3DFMT_A4R4G4B4;
  FMT_ALPHA=D3DFMT_A8R8G8B8;
var
  i:integer;
  AGF:TAGFImage;
begin
  FImages.Clear;
  for i:=0 to VTDb.RecordCount-1 do
    begin
    AGF:=TAGFImage.Create;
    CheckError(AGF.LoadFromVTDb(VTDb,FormMain.PowerGraph.D3DDevice8,VTDb.RecordKey[i],FMT_ALPHA),AGF.ErrorString);
    FImages.AddObject(VTDb.RecordKey[i],AGF);
    end;
end;

procedure TPDDrawContext_RT.Text(Position: TPoint; Text: string;
  Center: Boolean; Font: TFontID);
begin

end;

function TPDDrawContext_RT.TextSize(Text: string; Font: TFontID): TPoint;
begin

end;

constructor TPDDrawContext_Design.Create;
begin
  inherited;
  FMapping:=TStringList.Create;
  LoadFromIni('..\..\mazec\bitmaps.ini');
end;

function TPDDrawContext_Design.GetBmpIDIndex(BmpId:TBmpId):Integer;
begin
  Result:=FMapping.Count-1;
  while Result>0 do
    begin
    if TBmpId(FMapping.Objects[Result])=BmpId then
      exit;
    dec(Result);
    end;
end;

function TPDDrawContext_Design.GetBmp(BmpId:TBmpId):Integer;
begin
  Result:=FormMain.VTDb.RecordNum[FMapping[GetBmpIdIndex(BmpId)]];
end;

procedure TPDDrawContext_Design.LoadFromIni(aFileName: string);
var
  ini:TIniFile;
  S:TStringList;
  i:integer;
begin
  S:=TStringList.Create;
  ini:=TIniFile.Create(aFileName);
  try
    ini.ReadSections(S);
    FMapping.Clear;
    for i:=0 to S.Count-1 do
      begin
      FMapping.AddObject(
        Ini.ReadString(S[i],'Alias',''),
        TObject(ini.ReadInteger(S[i],'BmpId',i)));
      end;
  finally
    S.Free;
    ini.FRee;
  end;
end;

{ TPDInputContext }

constructor TPDInputContext.Create(aDC: TDrawContext);
begin
  FDC:=aDC;
end;

function TPDInputContext.GetGroundMousePos: TWPoint;
begin
  if FWMousePos.x=-MAXINT then
    begin
    FWMousePos:=FDC.Trans.ScreenToWorld(FMousePos);
    end;
  Result:=FWMousePos;
end;

function TPDInputContext.GetKey(Key: Integer): Boolean;
begin
  //
  Result:=False;
end;

function TPDInputContext.GetMousePos: TPoint;
begin
  Result:=FMousePos;
end;

function TPDInputContext.GetWMousePos(z: Integer): TWPoint;
begin
  Result:=FDC.Trans.ScreenToWorld(FMousePos,z);
end;

procedure TPDInputContext.SetMouseCursor(cur: Integer);
begin
  FormMain.MouseCursor.Cursor:=cur;
end;

function TPDInputContext.SetupInputs:Boolean;
begin
  Result:=not PtComp(FormMain.MousePos,FMousePos);
  if Result then
    begin
    FMousePos:=FormMain.MousePos;
    FWMousePos.x:=-MAXINT;
    end;
end;

end.