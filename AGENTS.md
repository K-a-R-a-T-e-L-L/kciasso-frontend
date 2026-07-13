# KCIASSO frontend instructions

Этот репозиторий является frontend-частью KCIASSO.

Связанный backend:

`D:\Desktop\dev\web\orders\kciasso-backend`

Канонический `PROJECT_STATE.md`:

`D:\Desktop\dev\web\orders\kciasso-backend\PROJECT_STATE.md`

Канонический отчёт:

`D:\Desktop\dev\web\orders\kciasso-backend\отчёт.txt`

Не создавать `PROJECT_STATE.md` или `отчёт.txt` во frontend.

Не изменять вручную:

`src/shared/api/generated/**`

Запускать Kubb generation только после изменения OpenAPI-контракта.

Соблюдать глобальные правила управления процессами: останавливать только процессы, запущенные текущей задачей, и не выполнять глобальный `taskkill node.exe`.
