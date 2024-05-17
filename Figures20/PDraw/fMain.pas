unit fMain;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,
  PInput, PDrawEx, VTDUnit, PowerTiming, PowerFont,
  DirectXGraphics, AGFUnit, uGame, DC_PowerDraw, CBitmaps, PowerD3D,
  GUIManager, BitmapManager, PDrawManager, GUIWidgets, LoadedAGFImage,
  GUIFrame, PDrawMouse, frmImgButton;
type
  TFormMain = class(TForm)
    fntTimesRoman: TPowerFont;
    PowerGraph: TPowerGraph;
    PowerTimer: TPowerTimer;
    VTDb: TVTDb;
    PowerInput: TPowerInput;
    GUIScreen: TGUIScreen;
    Manager: TPDrawBitmapGUIManager;
    VTDbGUI: TVTDb;
    imgKostka: TLoadedAGFImage;
    panInfo: TGUIContainer;
    labFPS: TGUILabel;
    labTim: TGUILabel;
    labDelta: TGUILabel;
    btnKostka: TGUIButton;
    imgIcons: TLoadedAGFImage;
    MouseCursor: TPDrawMouse;
    fImgButtonMenu: TfrmImageButton;
    mnuPopup: TGUIContainer;
    frmImageButton2: TfrmImageButton;
    frmImageButton3: TfrmImageButton;
    frmImageButton4: TfrmImageButton;
    frmImageButton5: TfrmImageButton;
    frmImageButton6: TfrmImageButton;
    procedure FormCreate(Sender: TObject);
    procedure PowerTimerRealTime(Sender: TObject; Delta: Double);
    procedure btnKostkaDraw(Sender: TGUIControl;
      var DefaultDraw: Boolean);
    procedure frmImageButton1GUIButtonClick(Sender: TObject);
    procedure mnuPopupMouseUp(Sender: TGUIControl; const MousePos: TPoint;
      const Button: TGUIMouseButton);
    procedure frmImageButton4GUIButtonClick(Sender: TObject);
  private
    procedure LoadGrafix(aFileName: string);
    { Private declarations }
  public
    { Public declarations }
    FrameTime:double;
    IC:TPDInputContext;
    DC:TPDDrawContext;
    MousePos:TPoint;
    //MouseCursor:Integer;
    Game:TGame;
  end;

var
  FormMain: TFormMain;

implementation
uses GUIDialogs;
{$R *.DFM}

procedure TFormMain.FormCreate(Sender: TObject);
begin
  ClientWidth:=PowerGraph.Width;
  ClientHeight:=PowerGraph.Height;
  PowerGraph.Initialize;
  //PDrawExDLLName:= 'D:/program files/borland/delphi5/powerdraw/Misc/' + PDrawExDLLName;
  fntTimesRoman.LoadFromFile('TimesBig.Fnt',D3DFMT_A1R5G5B5);
  DC:=TPDDrawContext.Create;
  IC:=TPDInputContext.Create(DC);
  LoadGrafix('clobrdo.vtd');
  Manager.Initialize();
  Manager.Reconfigure(Manager.RootControl);
  GUIScreen.ScreenPosition:=point(0,0);
  GUIScreen.Width:=PowerGraph.Width;
  GUIScreen.Height:=PowerGraph.Height;
  Game:=TGame.Create;
  Screen.Cursor:=crNone;
  FrameTime:=0;
end;

procedure TFormMain.LoadGrafix(aFileName:string);
begin
  VTDb.FileName:=aFileName;
  CheckError(VTDb.Initialize,VTDb.ErrorString);
  DC.Load(VTDb);
end;

procedure TFormMain.PowerTimerRealTime(Sender: TObject; Delta: Double);
var
  i:Integer;
begin
//  SimTime:=trunc(SimTime+Delta);
  PowerGraph.Clear($FF808080);
//  PowerGraph.Clear($FF000000);
  PowerGraph.BeginScene;
    Manager.ProcessInput;
    MousePos:=Manager.MousePos;
    if Delta<10 then
      FrameTime:=FrameTime+1000*Delta/PowerTimer.FPS;
    i:=4;
    Inc(Game.GameTime,i);
    if IC.SetupInputs then
      begin
      Game.ProcessInput(IC);
      end;
    Game.Draw(DC);
    labFPS.Caption:='FPS:'+IntToStr(PowerTimer.FrameRate);
    labTim.Caption:='time:'+FormatFloat('00.00',FrameTime);
    labDelta.Caption:='delta:'+FormatFloat('0.000',Delta);
    Manager.Draw;
    MouseCursor.Draw(MousePos);
  PowerGraph.EndScene;
  PowerGraph.Present;
end;

procedure TFormMain.btnKostkaDraw(Sender: TGUIControl;
  var DefaultDraw: Boolean);
begin
  PowerGraph.RenderEffect(imgKostka.Img,Sender.ScreenPosition.x,Sender.ScreenPosition.y,Sender.Tag,effectSrcAlpha);
  if btnKostka.Down then
    btnKostka.Tag:=random(6);
  DefaultDraw:=False;
end;

procedure TFormMain.frmImageButton1GUIButtonClick(Sender: TObject);
begin
  mnuPopup.Left:=fImgButtonMenu.GUIButton.Left-mnuPopup.Width;
  mnuPopup.Top:=fImgButtonMenu.GUIButton.Top;
  GUIScreen.ShowModal(mnuPopup);
  mnuPopup.Visible:=False;
  fImgButtonMenu.GUIButton.Down:=False;
end;

procedure TFormMain.mnuPopupMouseUp(Sender: TGUIControl;
  const MousePos: TPoint; const Button: TGUIMouseButton);
begin
  Sender.ModalResult:=mrCancel;
end;

procedure TFormMain.frmImageButton4GUIButtonClick(Sender: TObject);
begin
  if GUIMessageBox(GUIScreen,'Exit','Are you sure ?')=mrOk then
    close;
end;

end.

