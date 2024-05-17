program Clobrdo;

uses
  Forms,
  fMain in 'fMain.pas' {FormMain},
  uGame in '..\uGame.pas',
  CObjects1 in '..\CObjects1.pas',
  CBitmaps in '..\CBitmaps.pas',
  fMessageDlg in '..\..\PDraw\PGUI\Dialogs\fMessageDlg.pas' {FormMessageDialog},
  GUIFrame in '..\..\GUI\GUIFrame.pas' {GUIFrameSimulation: TFrame},
  frmImgButton in 'frmImgButton.pas' {frmImageButton: TFrame};

{$R *.RES}

begin
  Application.Initialize;
  Application.CreateForm(TFormMain, FormMain);
  Application.CreateForm(TFormMessageDialog, FormMessageDialog);
  Application.Run;
end.
