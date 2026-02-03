;;; geneia-mode.el --- Major mode for Geneia programming language -*- lexical-binding: t; -*-

;; Copyright (C) 2025 Moude AI Inc.
;; Author: Moude AI Inc.
;; Version: 1.0.0
;; Keywords: languages, geneia
;; Package-Requires: ((emacs "24.3"))

;;; Commentary:
;; Major mode for editing Geneia (.gn) files.

;;; Code:

(defvar geneia-mode-syntax-table
  (let ((table (make-syntax-table)))
    ;; Comments: ! ... !
    (modify-syntax-entry ?! "!" table)
    ;; Strings
    (modify-syntax-entry ?' "\"" table)
    (modify-syntax-entry ?\" "\"" table)
    ;; Brackets
    (modify-syntax-entry ?\{ "(}" table)
    (modify-syntax-entry ?\} "){" table)
    (modify-syntax-entry ?\( "()" table)
    (modify-syntax-entry ?\) ")(" table)
    (modify-syntax-entry ?\[ "(]" table)
    (modify-syntax-entry ?\] ")[" table)
    table)
  "Syntax table for `geneia-mode'.")

(defvar geneia-font-lock-keywords
  (list
   ;; Comments
   '("!\\([^!]*\\)!" . font-lock-comment-face)
   ;; Tips
   '("\"[^\"]*\"" . font-lock-doc-face)
   ;; Module functions
   '("\\.[A-Z][a-zA-Z]*\\.[a-zA-Z]+" . font-lock-function-name-face)
   ;; Module imports
   '("\\<\\(G_Render\\|G_Web\\|OpenGSL\\|OpenGWS\\|OpenW2G\\|OpenGNEL\\|GeneiaUI\\)\\>" . font-lock-type-face)
   ;; Flags
   '("--[a-zA-Z]+" . font-lock-constant-face)
   '("\\s-\\(-[a-zA-Z]\\)\\>" 1 font-lock-constant-face)
   ;; Control keywords
   '("\\<\\(peat\\|repeat\\|turn\\|exit\\|check\\|when\\|loop\\|func\\|give\\|back\\|stop\\|skip\\|each\\)\\>" . font-lock-keyword-face)
   ;; Import keywords
   '("\\<\\(import\\|use\\|from\\|export\\)\\>" . font-lock-keyword-face)
   ;; Storage types
   '("\\<\\(str\\|hold\\|var\\|msg\\)\\>" . font-lock-type-face)
   ;; Builtin functions
   '("\\<\\(gmath\\|time\\|sys\\)\\>" . font-lock-builtin-face)
   ;; Math functions
   '("\\<\\(add\\|sub\\|mul\\|div\\|mod\\|rand\\|len\\|wait\\|sqrt\\|abs\\|sin\\|cos\\|tan\\|floor\\|ceil\\|round\\|pi\\|e\\)\\>" . font-lock-builtin-face)
   ;; String functions
   '("\\<\\(upper\\|lower\\|trim\\|rev\\|math\\|join\\|split\\|size\\|push\\|pop\\)\\>" . font-lock-builtin-face)
   ;; Time functions
   '("\\<\\(now\\|unix\\|year\\|month\\|day\\|hour\\)\\>" . font-lock-builtin-face)
   ;; System functions
   '("\\<\\(os\\|arch\\|sleep\\)\\>" . font-lock-builtin-face)
   ;; Collection functions
   '("\\<\\(list\\|set\\|del\\|has\\|make\\|call\\|done\\|take\\|send\\|get\\)\\>" . font-lock-builtin-face)
   ;; Time units
   '("\\<t\\.[a-z]+\\>" . font-lock-type-face)
   ;; Variables in braces
   '("{\\([^}]*\\)}" 1 font-lock-variable-name-face)
   ;; Numbers
   '("\\<[0-9]+\\(\\.[0-9]+\\)?\\>" . font-lock-constant-face)
   '("(\\s*-?[0-9]+\\(\\.[0-9]+\\)?\\s*)" . font-lock-constant-face)
   ;; Strings
   '("'[^']*'" . font-lock-string-face))
  "Keyword highlighting for `geneia-mode'.")

;;;###autoload
(define-derived-mode geneia-mode prog-mode "Geneia"
  "Major mode for editing Geneia files."
  :syntax-table geneia-mode-syntax-table
  (setq-local font-lock-defaults '(geneia-font-lock-keywords))
  (setq-local comment-start "!")
  (setq-local comment-end "!")
  (setq-local indent-tabs-mode nil)
  (setq-local tab-width 2))

;;;###autoload
(add-to-list 'auto-mode-alist '("\\.gn\\'" . geneia-mode))

(provide 'geneia-mode)
;;; geneia-mode.el ends here
