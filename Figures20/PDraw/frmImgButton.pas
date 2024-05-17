unit frmImgButton;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,
  GUIFrame, GUIManager, GUIWidgets, PDrawManager, BitmapManager, PowerD3D;

type
  TfrmImageButton = class(TGUIFrameSimulation)
    GUIButton: TGUIButton;
    procedure GUIButtonDraw(Sender: TGUIControl;
      var DefaultDraw: Boolean);
  private
    { Private declarations }
  public
    { Public declarations }
    constructor Create(AOwner:TComponent);override;
  end;

var
  frmImageButton: TfrmImageButton;

implementation

uses fMain,ptutils;

{$R *.DFM}
var
  ImgBmp:TPDrawBitmap;

constructor TfrmImageButton.Create(AOwner: TComponent);
begin
  inherited;
end;

procedure TfrmImageButton.GUIButtonDraw(Sender: TGUIControl;
  var DefaultDraw: Boolean);
var
  pt:TPoint;
  r:TRect;
begin
  if ImgBmp=nil then
    begin
    ImgBmp:=TPDrawBitmap.Create(FormMain.Manager,bstAll,[bsNormal]);
    ImgBmp.BitmapUsedStates := [bsNormal, bsSelected];
    ImgBmp.Kind := bkResize;
    ImgBmp.RecName := 'GUI';
    ImgBmp.ImgX := 153;
    ImgBmp.ImgY := 3;
    ImgBmp.ImgW := 45;
    ImgBmp.ImgH := 35;
    end;
  r:=Sender.ScreenRect;
  FormMain.Manager.DrawBitmap(ImgBmp,r,Sender.GetBitmapState);
  pt:=ptCenter( ptAdd(r.TopLeft, ptSub(r.BottomRight, point(FormMain.imgIcons.Img.PatternWidth,FormMain.imgIcons.Img.PatternHeight))));
  if Sender.GetBitmapState=bsSelected then
    pt:=ptAdd(pt,FormMain.Manager.OffsetDown.Point)
  else
    pt:=ptAdd(pt,FormMain.Manager.OffsetUp.Point);
  FormMain.PowerGraph.RenderEffect(FormMain.imgIcons.Img,pt.x,pt.y,Sender.Tag,effectSrcAlpha);
  DefaultDraw:=False;
end;

end.
