object FormMain: TFormMain
  Left = 219
  Top = 120
  Width = 808
  Height = 627
  Caption = 'Clobrdo'
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = False
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 13
  object GUIScreen: TGUIScreen
    Left = 0
    Top = 0
    Width = 800
    Height = 600
    Enabled = True
    Visible = True
    GUIManager = Manager
    Font = 'PLEASANT12'
    object panInfo: TGUIContainer
      Left = 8
      Top = 16
      Width = 233
      Height = 80
      ParentControl = GUIScreen
      Enabled = True
      Visible = True
      object labFPS: TGUILabel
        Left = 8
        Top = 8
        Width = 200
        Height = 20
        ParentControl = panInfo
        Enabled = True
        Visible = True
        Caption = 'labFPS'
        AutoSize = False
        Font = 'TIMES8'
      end
      object labTim: TGUILabel
        Left = 8
        Top = 32
        Width = 201
        Height = 20
        ParentControl = panInfo
        Enabled = True
        Visible = True
        Caption = 'labTim'
        AutoSize = False
        Font = 'TIMES8'
      end
      object labDelta: TGUILabel
        Left = 8
        Top = 56
        Width = 201
        Height = 20
        ParentControl = panInfo
        Enabled = True
        Visible = True
        Caption = 'labTim'
        AutoSize = False
        Font = 'TIMES8'
      end
    end
    object btnKostka: TGUIButton
      Left = 680
      Top = 16
      Width = 104
      Height = 97
      ParentControl = GUIScreen
      Enabled = True
      Visible = True
      OnDraw = btnKostkaDraw
      Caption = 'btnKostka'
      DropDown = True
      Down = False
      ModalResult = 0
    end
    inline fImgButtonMenu: TfrmImageButton
      Left = 720
      Top = 536
      Width = 57
      Height = 49
      TabOrder = 2
      inherited GUIButton: TGUIButton
        Tag = 4
        DropDown = True
        OnClick = frmImageButton1GUIButtonClick
      end
    end
    object mnuPopup: TGUIContainer
      Left = 448
      Top = 536
      Width = 265
      Height = 57
      ParentControl = GUIScreen
      Enabled = True
      Visible = False
      OnMouseUp = mnuPopupMouseUp
      inline frmImageButton2: TfrmImageButton
        Left = 20
        Width = 49
        Height = 57
        Align = alRight
        inherited GUIButton: TGUIButton
          Tag = 1
          Caption = 'load'
          ModalResult = 1
        end
      end
      inline frmImageButton3: TfrmImageButton
        Left = 69
        Width = 49
        Height = 57
        Align = alRight
        TabOrder = 1
        inherited GUIButton: TGUIButton
          Tag = 2
          Caption = 'save'
          ModalResult = 1
        end
      end
      inline frmImageButton4: TfrmImageButton
        Left = 118
        Width = 49
        Height = 57
        Align = alRight
        TabOrder = 2
        inherited GUIButton: TGUIButton
          Caption = 'exit'
          OnClick = frmImageButton4GUIButtonClick
          ModalResult = 1
        end
      end
      inline frmImageButton5: TfrmImageButton
        Left = 167
        Width = 49
        Height = 57
        Align = alRight
        TabOrder = 3
        inherited GUIButton: TGUIButton
          Tag = 3
          Caption = 'cfg'
          ModalResult = 1
        end
      end
      inline frmImageButton6: TfrmImageButton
        Left = 216
        Width = 49
        Height = 57
        Align = alRight
        TabOrder = 4
        inherited GUIButton: TGUIButton
          Tag = 5
          Caption = 'help'
          ModalResult = 1
        end
      end
    end
  end
  object fntTimesRoman: TPowerFont
    PowerGraph = PowerGraph
    Left = 488
    Top = 72
  end
  object PowerGraph: TPowerGraph
    Antialias = False
    Dithering = False
    Hardware = True
    FullScreen = False
    Width = 800
    Height = 600
    BackBufferCount = 1
    BitDepth = bd_High
    ZBuffer = zb_None
    VSync = False
    RefreshRate = rr_default
    CustomRefreshRate = 0
    Left = 408
    Top = 72
  end
  object PowerTimer: TPowerTimer
    MayProcess = False
    MayRender = True
    MayRealTime = True
    OnRealTime = PowerTimerRealTime
    Left = 448
    Top = 72
  end
  object VTDb: TVTDb
    FileName = 'F:\WORK\Delphi\Clobrdo\PDraw\clobrdo.vtd'
    OpenMode = opReadOnly
    Left = 528
    Top = 72
  end
  object PowerInput: TPowerInput
    DoMouse = True
    Left = 568
    Top = 72
  end
  object Manager: TPDrawBitmapGUIManager
    Fonts.Strings = (
      'TIMES16B'
      'TIMES8'
      'CPLEASANT14'
      'PLEASANT14'
      'PLEASANT12'
      'PLEASANT10'
      'PLEASANT8')
    RootControl = GUIScreen
    Screen.BitmapUsedStates = [bsNormal]
    Screen.Kind = bkResize
    Screen.ImgX = 0
    Screen.ImgY = 0
    Screen.ImgW = 0
    Screen.ImgH = 0
    Panel.BitmapUsedStates = [bsNormal, bsDisabled]
    Panel.Kind = bkResize
    Panel.RecName = 'GUI'
    Panel.ImgX = 153
    Panel.ImgY = 38
    Panel.ImgW = 44
    Panel.ImgH = 33
    CheckBox.Checked.BitmapUsedStates = [bsNormal]
    CheckBox.Checked.Kind = bkFix
    CheckBox.Checked.RecName = 'GUI'
    CheckBox.Checked.ImgX = 0
    CheckBox.Checked.ImgY = 78
    CheckBox.Checked.ImgW = 26
    CheckBox.Checked.ImgH = 26
    CheckBox.UnChecked.BitmapUsedStates = [bsNormal]
    CheckBox.UnChecked.Kind = bkFix
    CheckBox.UnChecked.RecName = 'GUI'
    CheckBox.UnChecked.ImgX = 0
    CheckBox.UnChecked.ImgY = 52
    CheckBox.UnChecked.ImgW = 26
    CheckBox.UnChecked.ImgH = 26
    RadioButton.Checked.BitmapUsedStates = [bsNormal]
    RadioButton.Checked.Kind = bkFix
    RadioButton.Checked.RecName = 'GUI'
    RadioButton.Checked.ImgX = 0
    RadioButton.Checked.ImgY = 26
    RadioButton.Checked.ImgW = 26
    RadioButton.Checked.ImgH = 26
    RadioButton.UnChecked.BitmapUsedStates = [bsNormal]
    RadioButton.UnChecked.Kind = bkFix
    RadioButton.UnChecked.RecName = 'GUI'
    RadioButton.UnChecked.ImgX = 0
    RadioButton.UnChecked.ImgY = 0
    RadioButton.UnChecked.ImgW = 26
    RadioButton.UnChecked.ImgH = 26
    Button.BitmapUsedStates = [bsNormal, bsSelected]
    Button.Kind = bkResize
    Button.RecName = 'GUI'
    Button.ImgX = 28
    Button.ImgY = 1
    Button.ImgW = 62
    Button.ImgH = 35
    Window.Inner.BitmapUsedStates = [bsNormal]
    Window.Inner.Kind = bkResize
    Window.Inner.RecName = 'GUI'
    Window.Inner.ImgX = 94
    Window.Inner.ImgY = 4
    Window.Inner.ImgW = 55
    Window.Inner.ImgH = 57
    Window.Caption.BitmapUsedStates = [bsNormal]
    Window.Caption.Kind = bkResize
    Window.Caption.RecName = 'GUI'
    Window.Caption.ImgX = 124
    Window.Caption.ImgY = 168
    Window.Caption.ImgW = 66
    Window.Caption.ImgH = 51
    Window.Grip.X = 5
    Window.Grip.Y = 5
    Window.CaptionOffset = 5
    ListBox.Area.BitmapUsedStates = [bsNormal, bsSelected, bsDisabled, bsHighlighted]
    ListBox.Area.Kind = bkResize
    ListBox.Area.ImgX = 0
    ListBox.Area.ImgY = 0
    ListBox.Area.ImgW = 26
    ListBox.Area.ImgH = 26
    ListBox.Item.BitmapUsedStates = [bsNormal, bsSelected, bsDisabled, bsHighlighted]
    ListBox.Item.Kind = bkResize
    ListBox.Item.ImgX = 0
    ListBox.Item.ImgY = 0
    ListBox.Item.ImgW = 26
    ListBox.Item.ImgH = 26
    ProgressBar.Area.BitmapUsedStates = [bsNormal, bsDisabled]
    ProgressBar.Area.Kind = bkResize
    ProgressBar.Area.ImgX = 0
    ProgressBar.Area.ImgY = 0
    ProgressBar.Area.ImgW = 26
    ProgressBar.Area.ImgH = 26
    ProgressBar.Item.BitmapUsedStates = [bsNormal, bsDisabled]
    ProgressBar.Item.Kind = bkResize
    ProgressBar.Item.ImgX = 0
    ProgressBar.Item.ImgY = 0
    ProgressBar.Item.ImgW = 26
    ProgressBar.Item.ImgH = 26
    Slider.Vertical.Area.BitmapUsedStates = [bsNormal]
    Slider.Vertical.Area.Kind = bkResize
    Slider.Vertical.Area.RecName = 'GUI'
    Slider.Vertical.Area.ImgX = 0
    Slider.Vertical.Area.ImgY = 0
    Slider.Vertical.Area.ImgW = 26
    Slider.Vertical.Area.ImgH = 78
    Slider.Vertical.Item.BitmapUsedStates = [bsNormal, bsSelected]
    Slider.Vertical.Item.Kind = bkFix
    Slider.Vertical.Item.RecName = 'GUI'
    Slider.Vertical.Item.ImgX = 104
    Slider.Vertical.Item.ImgY = 104
    Slider.Vertical.Item.ImgW = 26
    Slider.Vertical.Item.ImgH = 26
    Slider.Horizontal.Area.BitmapUsedStates = [bsNormal]
    Slider.Horizontal.Area.Kind = bkResize
    Slider.Horizontal.Area.RecName = 'GUI'
    Slider.Horizontal.Area.ImgX = 26
    Slider.Horizontal.Area.ImgY = 156
    Slider.Horizontal.Area.ImgW = 78
    Slider.Horizontal.Area.ImgH = 26
    Slider.Horizontal.Item.BitmapUsedStates = [bsNormal, bsSelected]
    Slider.Horizontal.Item.Kind = bkFix
    Slider.Horizontal.Item.RecName = 'GUI'
    Slider.Horizontal.Item.ImgX = 104
    Slider.Horizontal.Item.ImgY = 104
    Slider.Horizontal.Item.ImgW = 26
    Slider.Horizontal.Item.ImgH = 26
    ScrollBar.Vertical.Area.BitmapUsedStates = [bsNormal]
    ScrollBar.Vertical.Area.Kind = bkResize
    ScrollBar.Vertical.Area.RecName = 'GUI'
    ScrollBar.Vertical.Area.ImgX = 0
    ScrollBar.Vertical.Area.ImgY = 156
    ScrollBar.Vertical.Area.ImgW = 26
    ScrollBar.Vertical.Area.ImgH = 78
    ScrollBar.Vertical.Item.BitmapUsedStates = [bsNormal, bsSelected]
    ScrollBar.Vertical.Item.Kind = bkResize
    ScrollBar.Vertical.Item.RecName = 'GUI'
    ScrollBar.Vertical.Item.ImgX = 182
    ScrollBar.Vertical.Item.ImgY = 0
    ScrollBar.Vertical.Item.ImgW = 26
    ScrollBar.Vertical.Item.ImgH = 78
    ScrollBar.Horizontal.Area.BitmapUsedStates = [bsNormal]
    ScrollBar.Horizontal.Area.Kind = bkResize
    ScrollBar.Horizontal.Area.RecName = 'GUI'
    ScrollBar.Horizontal.Area.ImgX = 26
    ScrollBar.Horizontal.Area.ImgY = 156
    ScrollBar.Horizontal.Area.ImgW = 78
    ScrollBar.Horizontal.Area.ImgH = 26
    ScrollBar.Horizontal.Item.BitmapUsedStates = [bsNormal, bsSelected]
    ScrollBar.Horizontal.Item.Kind = bkResize
    ScrollBar.Horizontal.Item.RecName = 'GUI'
    ScrollBar.Horizontal.Item.ImgX = 26
    ScrollBar.Horizontal.Item.ImgY = 182
    ScrollBar.Horizontal.Item.ImgW = 78
    ScrollBar.Horizontal.Item.ImgH = 26
    IconButton.ArrowLeft.BitmapUsedStates = [bsNormal, bsSelected]
    IconButton.ArrowLeft.Kind = bkFix
    IconButton.ArrowLeft.RecName = 'GUI'
    IconButton.ArrowLeft.ImgX = 78
    IconButton.ArrowLeft.ImgY = 104
    IconButton.ArrowLeft.ImgW = 26
    IconButton.ArrowLeft.ImgH = 26
    IconButton.ArrowRight.BitmapUsedStates = [bsNormal, bsSelected]
    IconButton.ArrowRight.Kind = bkFix
    IconButton.ArrowRight.RecName = 'GUI'
    IconButton.ArrowRight.ImgX = 52
    IconButton.ArrowRight.ImgY = 104
    IconButton.ArrowRight.ImgW = 26
    IconButton.ArrowRight.ImgH = 26
    IconButton.ArrowUp.BitmapUsedStates = [bsNormal, bsSelected]
    IconButton.ArrowUp.Kind = bkFix
    IconButton.ArrowUp.RecName = 'GUI'
    IconButton.ArrowUp.ImgX = 0
    IconButton.ArrowUp.ImgY = 104
    IconButton.ArrowUp.ImgW = 26
    IconButton.ArrowUp.ImgH = 26
    IconButton.ArrowDown.BitmapUsedStates = [bsNormal, bsSelected]
    IconButton.ArrowDown.Kind = bkFix
    IconButton.ArrowDown.RecName = 'GUI'
    IconButton.ArrowDown.ImgX = 26
    IconButton.ArrowDown.ImgY = 104
    IconButton.ArrowDown.ImgW = 26
    IconButton.ArrowDown.ImgH = 26
    IconButton.WinClose.BitmapUsedStates = [bsNormal, bsSelected]
    IconButton.WinClose.Kind = bkFix
    IconButton.WinClose.ImgX = 0
    IconButton.WinClose.ImgY = 104
    IconButton.WinClose.ImgW = 26
    IconButton.WinClose.ImgH = 26
    OffsetDown.X = -1
    OffsetDown.Y = -1
    OffsetUp.X = 0
    OffsetUp.Y = 0
    PowerGraph = PowerGraph
    VTDBFonts = VTDbGUI
    VTDBFontsFormat = 21
    VTDBGUI = VTDbGUI
    VTDBGUIFormat = 21
    ResizePercent = 40
    Left = 408
    Top = 16
  end
  object VTDbGUI: TVTDb
    FileName = 'F:\WORK\Delphi\Clobrdo\PDraw\clogui.vtd'
    OpenMode = opReadOnly
    Left = 440
    Top = 16
  end
  object imgKostka: TLoadedAGFImage
    VTDb = VTDb
    RecordName = 'KOSTKA'
    Format = 21
    PowerGraph = PowerGraph
    Left = 416
    Top = 112
  end
  object imgIcons: TLoadedAGFImage
    VTDb = VTDbGUI
    RecordName = 'ICONS'
    Format = 21
    PowerGraph = PowerGraph
    Left = 456
    Top = 112
  end
  object MouseCursor: TPDrawMouse
    VTDb = VTDb
    RecordName = 'POINTERS'
    Format = 21
    PowerGraph = PowerGraph
    Cursor = 0
    HotSpots = '9,9;10,10;'
    Left = 496
    Top = 112
  end
end
