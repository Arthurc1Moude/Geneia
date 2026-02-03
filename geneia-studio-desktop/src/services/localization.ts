/**
 * Localization Service
 * Natural Language Support for Geneia Studio IDE
 * Pre-translated strings for instant language switching
 */

export interface Language {
  code: string
  name: string
  nativeName: string
  rtl?: boolean
}

// Supported languages
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
]

// All translations - hardcoded for instant switching
const translations: Record<string, Record<string, string>> = {
  en: {
    file: 'File', edit: 'Edit', view: 'View', run: 'Run', terminal: 'Terminal', help: 'Help',
    newFile: 'New File', newFolder: 'New Folder', openFile: 'Open File', openFolder: 'Open Folder',
    save: 'Save', saveAs: 'Save As', saveAll: 'Save All', close: 'Close', closeAll: 'Close All',
    exit: 'Exit', duplicate: 'Duplicate', popOut: 'Pop Out', splitRight: 'Split Right', splitDown: 'Split Down',
    undo: 'Undo', redo: 'Redo', cut: 'Cut', copy: 'Copy', paste: 'Paste',
    find: 'Find', replace: 'Replace', selectAll: 'Select All',
    commandPalette: 'Command Palette', zoomIn: 'Zoom In', zoomOut: 'Zoom Out', resetZoom: 'Reset Zoom',
    runCode: 'Run', stopCode: 'Stop', runWithoutDebugging: 'Run Without Debugging', startDebugging: 'Start Debugging',
    newTerminal: 'New Terminal', splitTerminal: 'Split Terminal', runTask: 'Run Task',
    welcome: 'Welcome', documentation: 'Documentation', reportIssue: 'Report Issue', about: 'About',
    explorer: 'Explorer', search: 'Search', git: 'Source Control', extensions: 'Extensions', account: 'Account',
    problems: 'Problems', output: 'Output', debug: 'Debug Console', ports: 'Ports',
    format: 'Format', clear: 'Clear', noFileOpen: 'No file open',
    errors: 'Errors', warnings: 'Warnings', line: 'Ln', column: 'Col',
    install: 'Install', uninstall: 'Uninstall', enable: 'Enable', disable: 'Disable',
    installed: 'Installed', marketplace: 'Marketplace',
    settings: 'Settings', theme: 'Theme', language: 'Language', fontSize: 'Font Size',
    cancel: 'Cancel', confirm: 'Confirm', delete: 'Delete', rename: 'Rename',
    refresh: 'Refresh', loading: 'Loading...', noResults: 'No results',
    // Account Panel
    signInToGeneia: 'Sign in to Geneia Studio', connectAccount: 'Connect your account to enable cloud sync and source control',
    editProfile: 'Edit Profile', accessTokens: 'Access Tokens', notifications: 'Notifications', privacySecurity: 'Privacy & Security',
    signOut: 'Sign Out', cloudSync: 'Cloud Sync', synced: 'Synced', signedInWith: 'Signed in with',
    continueWithGitHub: 'Continue with GitHub', continueWithGoogle: 'Continue with Google', continueWithMoude: 'Continue with Moude Pro',
    benefitsOfSigningIn: 'Benefits of signing in:', syncSettingsFiles: 'Sync settings and files across devices',
    pushPullGitHub: 'Push and pull from GitHub repositories', secureBackup: 'Secure backup of your projects',
    moudeProFeatures: 'Moude Pro: AI features & premium themes', termsPrivacy: 'By signing in, you agree to our',
    terms: 'Terms', and: 'and', privacyPolicy: 'Privacy Policy', or: 'or',
    connecting: 'Connecting...', waiting: 'Waiting...', enterCodeAtGitHub: 'Enter this code at GitHub:',
    open: 'Open', waitingForAuth: 'Waiting for authorization...', moudeProActive: 'Moude Pro Active',
    authCancelled: 'Authentication cancelled or expired', authFailed: 'Authentication failed. Please try again.',
    signedIn: 'Signed in', goodbye: 'Goodbye',
  },
  'zh-CN': {
    file: '文件', edit: '编辑', view: '查看', run: '运行', terminal: '终端', help: '帮助',
    newFile: '新建文件', newFolder: '新建文件夹', openFile: '打开文件', openFolder: '打开文件夹',
    save: '保存', saveAs: '另存为', saveAll: '全部保存', close: '关闭', closeAll: '全部关闭',
    exit: '退出', duplicate: '复制', popOut: '弹出窗口', splitRight: '向右拆分', splitDown: '向下拆分',
    undo: '撤销', redo: '重做', cut: '剪切', copy: '复制', paste: '粘贴',
    find: '查找', replace: '替换', selectAll: '全选',
    commandPalette: '命令面板', zoomIn: '放大', zoomOut: '缩小', resetZoom: '重置缩放',
    runCode: '运行', stopCode: '停止', runWithoutDebugging: '无调试运行', startDebugging: '开始调试',
    newTerminal: '新建终端', splitTerminal: '拆分终端', runTask: '运行任务',
    welcome: '欢迎', documentation: '文档', reportIssue: '报告问题', about: '关于',
    explorer: '资源管理器', search: '搜索', git: '源代码管理', extensions: '扩展', account: '账户',
    problems: '问题', output: '输出', debug: '调试控制台', ports: '端口',
    format: '格式化', clear: '清除', noFileOpen: '没有打开的文件',
    errors: '错误', warnings: '警告', line: '行', column: '列',
    install: '安装', uninstall: '卸载', enable: '启用', disable: '禁用',
    installed: '已安装', marketplace: '市场',
    settings: '设置', theme: '主题', language: '语言', fontSize: '字体大小',
    cancel: '取消', confirm: '确认', delete: '删除', rename: '重命名',
    refresh: '刷新', loading: '加载中...', noResults: '无结果',
    // Account Panel
    signInToGeneia: '登录 Geneia Studio', connectAccount: '连接您的账户以启用云同步和源代码管理',
    editProfile: '编辑资料', accessTokens: '访问令牌', notifications: '通知', privacySecurity: '隐私与安全',
    signOut: '退出登录', cloudSync: '云同步', synced: '已同步', signedInWith: '已通过以下方式登录',
    continueWithGitHub: '使用 GitHub 继续', continueWithGoogle: '使用 Google 继续', continueWithMoude: '使用 Moude Pro 继续',
    benefitsOfSigningIn: '登录的好处：', syncSettingsFiles: '跨设备同步设置和文件',
    pushPullGitHub: '从 GitHub 仓库推送和拉取', secureBackup: '安全备份您的项目',
    moudeProFeatures: 'Moude Pro：AI 功能和高级主题', termsPrivacy: '登录即表示您同意我们的',
    terms: '条款', and: '和', privacyPolicy: '隐私政策', or: '或',
    connecting: '连接中...', waiting: '等待中...', enterCodeAtGitHub: '在 GitHub 输入此代码：',
    open: '打开', waitingForAuth: '等待授权...', moudeProActive: 'Moude Pro 已激活',
    authCancelled: '认证已取消或过期', authFailed: '认证失败，请重试。',
    signedIn: '已登录', goodbye: '再见',
  },
  'zh-TW': {
    file: '檔案', edit: '編輯', view: '檢視', run: '執行', terminal: '終端機', help: '說明',
    newFile: '新增檔案', newFolder: '新增資料夾', openFile: '開啟檔案', openFolder: '開啟資料夾',
    save: '儲存', saveAs: '另存新檔', saveAll: '全部儲存', close: '關閉', closeAll: '全部關閉',
    exit: '結束', duplicate: '複製', popOut: '彈出視窗', splitRight: '向右分割', splitDown: '向下分割',
    undo: '復原', redo: '重做', cut: '剪下', copy: '複製', paste: '貼上',
    find: '尋找', replace: '取代', selectAll: '全選',
    commandPalette: '命令選擇區', zoomIn: '放大', zoomOut: '縮小', resetZoom: '重設縮放',
    runCode: '執行', stopCode: '停止', runWithoutDebugging: '執行但不偵錯', startDebugging: '開始偵錯',
    newTerminal: '新增終端機', splitTerminal: '分割終端機', runTask: '執行工作',
    welcome: '歡迎', documentation: '文件', reportIssue: '回報問題', about: '關於',
    explorer: '檔案總管', search: '搜尋', git: '原始檔控制', extensions: '擴充功能', account: '帳戶',
    problems: '問題', output: '輸出', debug: '偵錯主控台', ports: '連接埠',
    format: '格式化', clear: '清除', noFileOpen: '沒有開啟的檔案',
    errors: '錯誤', warnings: '警告', line: '行', column: '欄',
    install: '安裝', uninstall: '解除安裝', enable: '啟用', disable: '停用',
    installed: '已安裝', marketplace: '市集',
    settings: '設定', theme: '佈景主題', language: '語言', fontSize: '字型大小',
    cancel: '取消', confirm: '確認', delete: '刪除', rename: '重新命名',
    refresh: '重新整理', loading: '載入中...', noResults: '沒有結果',
    // Account Panel
    signInToGeneia: '登入 Geneia Studio', connectAccount: '連接您的帳戶以啟用雲端同步和原始碼控制',
    editProfile: '編輯個人資料', accessTokens: '存取權杖', notifications: '通知', privacySecurity: '隱私與安全',
    signOut: '登出', cloudSync: '雲端同步', synced: '已同步', signedInWith: '已透過以下方式登入',
    continueWithGitHub: '使用 GitHub 繼續', continueWithGoogle: '使用 Google 繼續', continueWithMoude: '使用 Moude Pro 繼續',
    benefitsOfSigningIn: '登入的好處：', syncSettingsFiles: '跨裝置同步設定和檔案',
    pushPullGitHub: '從 GitHub 儲存庫推送和拉取', secureBackup: '安全備份您的專案',
    moudeProFeatures: 'Moude Pro：AI 功能和進階主題', termsPrivacy: '登入即表示您同意我們的',
    terms: '條款', and: '和', privacyPolicy: '隱私政策', or: '或',
    connecting: '連接中...', waiting: '等待中...', enterCodeAtGitHub: '在 GitHub 輸入此代碼：',
    open: '開啟', waitingForAuth: '等待授權...', moudeProActive: 'Moude Pro 已啟用',
    authCancelled: '認證已取消或過期', authFailed: '認證失敗，請重試。',
    signedIn: '已登入', goodbye: '再見',
  },
  ja: {
    file: 'ファイル', edit: '編集', view: '表示', run: '実行', terminal: 'ターミナル', help: 'ヘルプ',
    newFile: '新規ファイル', newFolder: '新規フォルダ', openFile: 'ファイルを開く', openFolder: 'フォルダを開く',
    save: '保存', saveAs: '名前を付けて保存', saveAll: 'すべて保存', close: '閉じる', closeAll: 'すべて閉じる',
    exit: '終了', duplicate: '複製', popOut: 'ポップアウト', splitRight: '右に分割', splitDown: '下に分割',
    undo: '元に戻す', redo: 'やり直し', cut: '切り取り', copy: 'コピー', paste: '貼り付け',
    find: '検索', replace: '置換', selectAll: 'すべて選択',
    commandPalette: 'コマンドパレット', zoomIn: '拡大', zoomOut: '縮小', resetZoom: 'ズームをリセット',
    runCode: '実行', stopCode: '停止', runWithoutDebugging: 'デバッグなしで実行', startDebugging: 'デバッグ開始',
    newTerminal: '新しいターミナル', splitTerminal: 'ターミナルを分割', runTask: 'タスクを実行',
    welcome: 'ようこそ', documentation: 'ドキュメント', reportIssue: '問題を報告', about: 'バージョン情報',
    explorer: 'エクスプローラー', search: '検索', git: 'ソース管理', extensions: '拡張機能', account: 'アカウント',
    problems: '問題', output: '出力', debug: 'デバッグコンソール', ports: 'ポート',
    format: 'フォーマット', clear: 'クリア', noFileOpen: 'ファイルが開かれていません',
    errors: 'エラー', warnings: '警告', line: '行', column: '列',
    install: 'インストール', uninstall: 'アンインストール', enable: '有効', disable: '無効',
    installed: 'インストール済み', marketplace: 'マーケットプレイス',
    settings: '設定', theme: 'テーマ', language: '言語', fontSize: 'フォントサイズ',
    cancel: 'キャンセル', confirm: '確認', delete: '削除', rename: '名前の変更',
    refresh: '更新', loading: '読み込み中...', noResults: '結果なし',
    // Account Panel
    signInToGeneia: 'Geneia Studio にサインイン', connectAccount: 'アカウントを接続してクラウド同期とソース管理を有効にする',
    editProfile: 'プロフィールを編集', accessTokens: 'アクセストークン', notifications: '通知', privacySecurity: 'プライバシーとセキュリティ',
    signOut: 'サインアウト', cloudSync: 'クラウド同期', synced: '同期済み', signedInWith: 'でサインイン中',
    continueWithGitHub: 'GitHub で続行', continueWithGoogle: 'Google で続行', continueWithMoude: 'Moude Pro で続行',
    benefitsOfSigningIn: 'サインインのメリット：', syncSettingsFiles: 'デバイス間で設定とファイルを同期',
    pushPullGitHub: 'GitHub リポジトリへのプッシュとプル', secureBackup: 'プロジェクトの安全なバックアップ',
    moudeProFeatures: 'Moude Pro：AI機能とプレミアムテーマ', termsPrivacy: 'サインインすると、',
    terms: '利用規約', and: 'と', privacyPolicy: 'プライバシーポリシー', or: 'または',
    connecting: '接続中...', waiting: '待機中...', enterCodeAtGitHub: 'GitHub でこのコードを入力：',
    open: '開く', waitingForAuth: '認証を待っています...', moudeProActive: 'Moude Pro 有効',
    authCancelled: '認証がキャンセルまたは期限切れ', authFailed: '認証に失敗しました。再試行してください。',
    signedIn: 'サインイン完了', goodbye: 'さようなら',
  },
  ko: {
    file: '파일', edit: '편집', view: '보기', run: '실행', terminal: '터미널', help: '도움말',
    newFile: '새 파일', newFolder: '새 폴더', openFile: '파일 열기', openFolder: '폴더 열기',
    save: '저장', saveAs: '다른 이름으로 저장', saveAll: '모두 저장', close: '닫기', closeAll: '모두 닫기',
    exit: '종료', duplicate: '복제', popOut: '팝아웃', splitRight: '오른쪽으로 분할', splitDown: '아래로 분할',
    undo: '실행 취소', redo: '다시 실행', cut: '잘라내기', copy: '복사', paste: '붙여넣기',
    find: '찾기', replace: '바꾸기', selectAll: '모두 선택',
    commandPalette: '명령 팔레트', zoomIn: '확대', zoomOut: '축소', resetZoom: '확대/축소 재설정',
    runCode: '실행', stopCode: '중지', runWithoutDebugging: '디버깅 없이 실행', startDebugging: '디버깅 시작',
    newTerminal: '새 터미널', splitTerminal: '터미널 분할', runTask: '작업 실행',
    welcome: '환영합니다', documentation: '문서', reportIssue: '문제 보고', about: '정보',
    explorer: '탐색기', search: '검색', git: '소스 제어', extensions: '확장', account: '계정',
    problems: '문제', output: '출력', debug: '디버그 콘솔', ports: '포트',
    format: '서식', clear: '지우기', noFileOpen: '열린 파일 없음',
    errors: '오류', warnings: '경고', line: '줄', column: '열',
    install: '설치', uninstall: '제거', enable: '사용', disable: '사용 안 함',
    installed: '설치됨', marketplace: '마켓플레이스',
    settings: '설정', theme: '테마', language: '언어', fontSize: '글꼴 크기',
    cancel: '취소', confirm: '확인', delete: '삭제', rename: '이름 바꾸기',
    refresh: '새로 고침', loading: '로드 중...', noResults: '결과 없음',
  },
  es: {
    file: 'Archivo', edit: 'Editar', view: 'Ver', run: 'Ejecutar', terminal: 'Terminal', help: 'Ayuda',
    newFile: 'Nuevo archivo', newFolder: 'Nueva carpeta', openFile: 'Abrir archivo', openFolder: 'Abrir carpeta',
    save: 'Guardar', saveAs: 'Guardar como', saveAll: 'Guardar todo', close: 'Cerrar', closeAll: 'Cerrar todo',
    exit: 'Salir', duplicate: 'Duplicar', popOut: 'Abrir en ventana', splitRight: 'Dividir a la derecha', splitDown: 'Dividir abajo',
    undo: 'Deshacer', redo: 'Rehacer', cut: 'Cortar', copy: 'Copiar', paste: 'Pegar',
    find: 'Buscar', replace: 'Reemplazar', selectAll: 'Seleccionar todo',
    commandPalette: 'Paleta de comandos', zoomIn: 'Acercar', zoomOut: 'Alejar', resetZoom: 'Restablecer zoom',
    runCode: 'Ejecutar', stopCode: 'Detener', runWithoutDebugging: 'Ejecutar sin depurar', startDebugging: 'Iniciar depuración',
    newTerminal: 'Nuevo terminal', splitTerminal: 'Dividir terminal', runTask: 'Ejecutar tarea',
    welcome: 'Bienvenido', documentation: 'Documentación', reportIssue: 'Informar problema', about: 'Acerca de',
    explorer: 'Explorador', search: 'Buscar', git: 'Control de código', extensions: 'Extensiones', account: 'Cuenta',
    problems: 'Problemas', output: 'Salida', debug: 'Consola de depuración', ports: 'Puertos',
    format: 'Formatear', clear: 'Limpiar', noFileOpen: 'Sin archivo abierto',
    errors: 'Errores', warnings: 'Advertencias', line: 'Lín', column: 'Col',
    install: 'Instalar', uninstall: 'Desinstalar', enable: 'Habilitar', disable: 'Deshabilitar',
    installed: 'Instalado', marketplace: 'Marketplace',
    settings: 'Configuración', theme: 'Tema', language: 'Idioma', fontSize: 'Tamaño de fuente',
    cancel: 'Cancelar', confirm: 'Confirmar', delete: 'Eliminar', rename: 'Renombrar',
    refresh: 'Actualizar', loading: 'Cargando...', noResults: 'Sin resultados',
  },
  fr: {
    file: 'Fichier', edit: 'Édition', view: 'Affichage', run: 'Exécuter', terminal: 'Terminal', help: 'Aide',
    newFile: 'Nouveau fichier', newFolder: 'Nouveau dossier', openFile: 'Ouvrir un fichier', openFolder: 'Ouvrir un dossier',
    save: 'Enregistrer', saveAs: 'Enregistrer sous', saveAll: 'Tout enregistrer', close: 'Fermer', closeAll: 'Tout fermer',
    exit: 'Quitter', duplicate: 'Dupliquer', popOut: 'Ouvrir dans une fenêtre', splitRight: 'Diviser à droite', splitDown: 'Diviser en bas',
    undo: 'Annuler', redo: 'Rétablir', cut: 'Couper', copy: 'Copier', paste: 'Coller',
    find: 'Rechercher', replace: 'Remplacer', selectAll: 'Tout sélectionner',
    commandPalette: 'Palette de commandes', zoomIn: 'Zoom avant', zoomOut: 'Zoom arrière', resetZoom: 'Réinitialiser le zoom',
    runCode: 'Exécuter', stopCode: 'Arrêter', runWithoutDebugging: 'Exécuter sans débogage', startDebugging: 'Démarrer le débogage',
    newTerminal: 'Nouveau terminal', splitTerminal: 'Diviser le terminal', runTask: 'Exécuter la tâche',
    welcome: 'Bienvenue', documentation: 'Documentation', reportIssue: 'Signaler un problème', about: 'À propos',
    explorer: 'Explorateur', search: 'Rechercher', git: 'Contrôle de source', extensions: 'Extensions', account: 'Compte',
    problems: 'Problèmes', output: 'Sortie', debug: 'Console de débogage', ports: 'Ports',
    format: 'Formater', clear: 'Effacer', noFileOpen: 'Aucun fichier ouvert',
    errors: 'Erreurs', warnings: 'Avertissements', line: 'Lig', column: 'Col',
    install: 'Installer', uninstall: 'Désinstaller', enable: 'Activer', disable: 'Désactiver',
    installed: 'Installé', marketplace: 'Marketplace',
    settings: 'Paramètres', theme: 'Thème', language: 'Langue', fontSize: 'Taille de police',
    cancel: 'Annuler', confirm: 'Confirmer', delete: 'Supprimer', rename: 'Renommer',
    refresh: 'Actualiser', loading: 'Chargement...', noResults: 'Aucun résultat',
  },
  de: {
    file: 'Datei', edit: 'Bearbeiten', view: 'Ansicht', run: 'Ausführen', terminal: 'Terminal', help: 'Hilfe',
    newFile: 'Neue Datei', newFolder: 'Neuer Ordner', openFile: 'Datei öffnen', openFolder: 'Ordner öffnen',
    save: 'Speichern', saveAs: 'Speichern unter', saveAll: 'Alle speichern', close: 'Schließen', closeAll: 'Alle schließen',
    exit: 'Beenden', duplicate: 'Duplizieren', popOut: 'In Fenster öffnen', splitRight: 'Nach rechts teilen', splitDown: 'Nach unten teilen',
    undo: 'Rückgängig', redo: 'Wiederholen', cut: 'Ausschneiden', copy: 'Kopieren', paste: 'Einfügen',
    find: 'Suchen', replace: 'Ersetzen', selectAll: 'Alles auswählen',
    commandPalette: 'Befehlspalette', zoomIn: 'Vergrößern', zoomOut: 'Verkleinern', resetZoom: 'Zoom zurücksetzen',
    runCode: 'Ausführen', stopCode: 'Stoppen', runWithoutDebugging: 'Ohne Debuggen ausführen', startDebugging: 'Debuggen starten',
    newTerminal: 'Neues Terminal', splitTerminal: 'Terminal teilen', runTask: 'Aufgabe ausführen',
    welcome: 'Willkommen', documentation: 'Dokumentation', reportIssue: 'Problem melden', about: 'Info',
    explorer: 'Explorer', search: 'Suchen', git: 'Quellcodeverwaltung', extensions: 'Erweiterungen', account: 'Konto',
    problems: 'Probleme', output: 'Ausgabe', debug: 'Debug-Konsole', ports: 'Ports',
    format: 'Formatieren', clear: 'Löschen', noFileOpen: 'Keine Datei geöffnet',
    errors: 'Fehler', warnings: 'Warnungen', line: 'Zl', column: 'Sp',
    install: 'Installieren', uninstall: 'Deinstallieren', enable: 'Aktivieren', disable: 'Deaktivieren',
    installed: 'Installiert', marketplace: 'Marketplace',
    settings: 'Einstellungen', theme: 'Design', language: 'Sprache', fontSize: 'Schriftgröße',
    cancel: 'Abbrechen', confirm: 'Bestätigen', delete: 'Löschen', rename: 'Umbenennen',
    refresh: 'Aktualisieren', loading: 'Wird geladen...', noResults: 'Keine Ergebnisse',
  },
  it: {
    file: 'File', edit: 'Modifica', view: 'Visualizza', run: 'Esegui', terminal: 'Terminale', help: 'Guida',
    newFile: 'Nuovo file', newFolder: 'Nuova cartella', openFile: 'Apri file', openFolder: 'Apri cartella',
    save: 'Salva', saveAs: 'Salva con nome', saveAll: 'Salva tutto', close: 'Chiudi', closeAll: 'Chiudi tutto',
    exit: 'Esci', duplicate: 'Duplica', popOut: 'Apri in finestra', splitRight: 'Dividi a destra', splitDown: 'Dividi in basso',
    undo: 'Annulla', redo: 'Ripeti', cut: 'Taglia', copy: 'Copia', paste: 'Incolla',
    find: 'Trova', replace: 'Sostituisci', selectAll: 'Seleziona tutto',
    commandPalette: 'Riquadro comandi', zoomIn: 'Zoom avanti', zoomOut: 'Zoom indietro', resetZoom: 'Reimposta zoom',
    runCode: 'Esegui', stopCode: 'Ferma', runWithoutDebugging: 'Esegui senza debug', startDebugging: 'Avvia debug',
    newTerminal: 'Nuovo terminale', splitTerminal: 'Dividi terminale', runTask: 'Esegui attività',
    welcome: 'Benvenuto', documentation: 'Documentazione', reportIssue: 'Segnala problema', about: 'Informazioni',
    explorer: 'Esplora', search: 'Cerca', git: 'Controllo sorgente', extensions: 'Estensioni', account: 'Account',
    problems: 'Problemi', output: 'Output', debug: 'Console di debug', ports: 'Porte',
    format: 'Formatta', clear: 'Cancella', noFileOpen: 'Nessun file aperto',
    errors: 'Errori', warnings: 'Avvisi', line: 'Riga', column: 'Col',
    install: 'Installa', uninstall: 'Disinstalla', enable: 'Abilita', disable: 'Disabilita',
    installed: 'Installato', marketplace: 'Marketplace',
    settings: 'Impostazioni', theme: 'Tema', language: 'Lingua', fontSize: 'Dimensione carattere',
    cancel: 'Annulla', confirm: 'Conferma', delete: 'Elimina', rename: 'Rinomina',
    refresh: 'Aggiorna', loading: 'Caricamento...', noResults: 'Nessun risultato',
  },
  pt: {
    file: 'Arquivo', edit: 'Editar', view: 'Exibir', run: 'Executar', terminal: 'Terminal', help: 'Ajuda',
    newFile: 'Novo arquivo', newFolder: 'Nova pasta', openFile: 'Abrir arquivo', openFolder: 'Abrir pasta',
    save: 'Salvar', saveAs: 'Salvar como', saveAll: 'Salvar tudo', close: 'Fechar', closeAll: 'Fechar tudo',
    exit: 'Sair', duplicate: 'Duplicar', popOut: 'Abrir em janela', splitRight: 'Dividir à direita', splitDown: 'Dividir abaixo',
    undo: 'Desfazer', redo: 'Refazer', cut: 'Recortar', copy: 'Copiar', paste: 'Colar',
    find: 'Localizar', replace: 'Substituir', selectAll: 'Selecionar tudo',
    commandPalette: 'Paleta de comandos', zoomIn: 'Ampliar', zoomOut: 'Reduzir', resetZoom: 'Redefinir zoom',
    runCode: 'Executar', stopCode: 'Parar', runWithoutDebugging: 'Executar sem depuração', startDebugging: 'Iniciar depuração',
    newTerminal: 'Novo terminal', splitTerminal: 'Dividir terminal', runTask: 'Executar tarefa',
    welcome: 'Bem-vindo', documentation: 'Documentação', reportIssue: 'Relatar problema', about: 'Sobre',
    explorer: 'Explorador', search: 'Pesquisar', git: 'Controle de código', extensions: 'Extensões', account: 'Conta',
    problems: 'Problemas', output: 'Saída', debug: 'Console de depuração', ports: 'Portas',
    format: 'Formatar', clear: 'Limpar', noFileOpen: 'Nenhum arquivo aberto',
    errors: 'Erros', warnings: 'Avisos', line: 'Lin', column: 'Col',
    install: 'Instalar', uninstall: 'Desinstalar', enable: 'Habilitar', disable: 'Desabilitar',
    installed: 'Instalado', marketplace: 'Marketplace',
    settings: 'Configurações', theme: 'Tema', language: 'Idioma', fontSize: 'Tamanho da fonte',
    cancel: 'Cancelar', confirm: 'Confirmar', delete: 'Excluir', rename: 'Renomear',
    refresh: 'Atualizar', loading: 'Carregando...', noResults: 'Sem resultados',
  },
  ru: {
    file: 'Файл', edit: 'Правка', view: 'Вид', run: 'Запуск', terminal: 'Терминал', help: 'Справка',
    newFile: 'Новый файл', newFolder: 'Новая папка', openFile: 'Открыть файл', openFolder: 'Открыть папку',
    save: 'Сохранить', saveAs: 'Сохранить как', saveAll: 'Сохранить все', close: 'Закрыть', closeAll: 'Закрыть все',
    exit: 'Выход', duplicate: 'Дублировать', popOut: 'Открыть в окне', splitRight: 'Разделить вправо', splitDown: 'Разделить вниз',
    undo: 'Отменить', redo: 'Повторить', cut: 'Вырезать', copy: 'Копировать', paste: 'Вставить',
    find: 'Найти', replace: 'Заменить', selectAll: 'Выделить все',
    commandPalette: 'Палитра команд', zoomIn: 'Увеличить', zoomOut: 'Уменьшить', resetZoom: 'Сбросить масштаб',
    runCode: 'Запустить', stopCode: 'Остановить', runWithoutDebugging: 'Запуск без отладки', startDebugging: 'Начать отладку',
    newTerminal: 'Новый терминал', splitTerminal: 'Разделить терминал', runTask: 'Выполнить задачу',
    welcome: 'Добро пожаловать', documentation: 'Документация', reportIssue: 'Сообщить о проблеме', about: 'О программе',
    explorer: 'Проводник', search: 'Поиск', git: 'Система контроля версий', extensions: 'Расширения', account: 'Учётная запись',
    problems: 'Проблемы', output: 'Вывод', debug: 'Консоль отладки', ports: 'Порты',
    format: 'Форматировать', clear: 'Очистить', noFileOpen: 'Нет открытых файлов',
    errors: 'Ошибки', warnings: 'Предупреждения', line: 'Стр', column: 'Стлб',
    install: 'Установить', uninstall: 'Удалить', enable: 'Включить', disable: 'Отключить',
    installed: 'Установлено', marketplace: 'Магазин',
    settings: 'Настройки', theme: 'Тема', language: 'Язык', fontSize: 'Размер шрифта',
    cancel: 'Отмена', confirm: 'Подтвердить', delete: 'Удалить', rename: 'Переименовать',
    refresh: 'Обновить', loading: 'Загрузка...', noResults: 'Нет результатов',
  },
  ar: {
    file: 'ملف', edit: 'تحرير', view: 'عرض', run: 'تشغيل', terminal: 'طرفية', help: 'مساعدة',
    newFile: 'ملف جديد', newFolder: 'مجلد جديد', openFile: 'فتح ملف', openFolder: 'فتح مجلد',
    save: 'حفظ', saveAs: 'حفظ باسم', saveAll: 'حفظ الكل', close: 'إغلاق', closeAll: 'إغلاق الكل',
    exit: 'خروج', duplicate: 'تكرار', popOut: 'فتح في نافذة', splitRight: 'تقسيم لليمين', splitDown: 'تقسيم للأسفل',
    undo: 'تراجع', redo: 'إعادة', cut: 'قص', copy: 'نسخ', paste: 'لصق',
    find: 'بحث', replace: 'استبدال', selectAll: 'تحديد الكل',
    commandPalette: 'لوحة الأوامر', zoomIn: 'تكبير', zoomOut: 'تصغير', resetZoom: 'إعادة تعيين التكبير',
    runCode: 'تشغيل', stopCode: 'إيقاف', runWithoutDebugging: 'تشغيل بدون تصحيح', startDebugging: 'بدء التصحيح',
    newTerminal: 'طرفية جديدة', splitTerminal: 'تقسيم الطرفية', runTask: 'تشغيل مهمة',
    welcome: 'مرحباً', documentation: 'التوثيق', reportIssue: 'الإبلاغ عن مشكلة', about: 'حول',
    explorer: 'المستكشف', search: 'بحث', git: 'التحكم بالمصدر', extensions: 'الإضافات', account: 'الحساب',
    problems: 'المشاكل', output: 'المخرجات', debug: 'وحدة التصحيح', ports: 'المنافذ',
    format: 'تنسيق', clear: 'مسح', noFileOpen: 'لا يوجد ملف مفتوح',
    errors: 'أخطاء', warnings: 'تحذيرات', line: 'سطر', column: 'عمود',
    install: 'تثبيت', uninstall: 'إلغاء التثبيت', enable: 'تفعيل', disable: 'تعطيل',
    installed: 'مثبت', marketplace: 'السوق',
    settings: 'الإعدادات', theme: 'السمة', language: 'اللغة', fontSize: 'حجم الخط',
    cancel: 'إلغاء', confirm: 'تأكيد', delete: 'حذف', rename: 'إعادة تسمية',
    refresh: 'تحديث', loading: 'جاري التحميل...', noResults: 'لا توجد نتائج',
  },
}

// Add prefixed keys for TitleBar compatibility
Object.keys(translations).forEach(lang => {
  const t = translations[lang]
  // Menu prefixes
  t['menu.file'] = t.file; t['menu.edit'] = t.edit; t['menu.view'] = t.view
  t['menu.run'] = t.run; t['menu.terminal'] = t.terminal; t['menu.help'] = t.help
  // File prefixes
  t['file.newFile'] = t.newFile; t['file.newFolder'] = t.newFolder
  t['file.openFile'] = t.openFile; t['file.openFolder'] = t.openFolder
  t['file.save'] = t.save; t['file.saveAs'] = t.saveAs; t['file.saveAll'] = t.saveAll
  t['file.close'] = t.close; t['file.closeAll'] = t.closeAll; t['file.exit'] = t.exit
  t['file.duplicate'] = t.duplicate; t['file.popOut'] = t.popOut
  t['file.splitRight'] = t.splitRight; t['file.splitDown'] = t.splitDown
  // Edit prefixes
  t['edit.undo'] = t.undo; t['edit.redo'] = t.redo; t['edit.cut'] = t.cut
  t['edit.copy'] = t.copy; t['edit.paste'] = t.paste; t['edit.find'] = t.find
  t['edit.replace'] = t.replace; t['edit.selectAll'] = t.selectAll
  // View prefixes
  t['view.commandPalette'] = t.commandPalette; t['view.problems'] = t.problems
  t['view.output'] = t.output; t['view.debug'] = t.debug; t['view.terminal'] = t.terminal
  t['view.ports'] = t.ports; t['view.zoomIn'] = t.zoomIn; t['view.zoomOut'] = t.zoomOut
  t['view.resetZoom'] = t.resetZoom
  // Run prefixes
  t['run.runCode'] = t.runCode; t['run.stopCode'] = t.stopCode
  t['run.runWithoutDebugging'] = t.runWithoutDebugging; t['run.startDebugging'] = t.startDebugging
  // Terminal prefixes
  t['terminal.newTerminal'] = t.newTerminal; t['terminal.splitTerminal'] = t.splitTerminal
  t['terminal.runTask'] = t.runTask
  // Help prefixes
  t['help.welcome'] = t.welcome; t['help.documentation'] = t.documentation
  t['help.reportIssue'] = t.reportIssue; t['help.about'] = t.about
})

// Current language
let currentLanguage = 'en'

export const LocalizationService = {
  getLanguage: () => currentLanguage,

  setLanguage(code: string) {
    if (SUPPORTED_LANGUAGES.find(l => l.code === code)) {
      currentLanguage = code
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === code)
      document.documentElement.dir = lang?.rtl ? 'rtl' : 'ltr'
    }
  },

  t(key: string): string {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  },

  preloadTranslations: async () => {}, // No-op, translations are hardcoded

  isSupported: (code: string) => SUPPORTED_LANGUAGES.some(l => l.code === code),
  getLanguageInfo: (code: string) => SUPPORTED_LANGUAGES.find(l => l.code === code),
  getAllLanguages: () => SUPPORTED_LANGUAGES,
  isRTL: () => SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.rtl || false,
}

export function useTranslation() {
  return {
    t: LocalizationService.t.bind(LocalizationService),
    language: currentLanguage,
    setLanguage: LocalizationService.setLanguage.bind(LocalizationService),
    isRTL: LocalizationService.isRTL(),
  }
}
