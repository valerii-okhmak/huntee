import axiosInstance from '../api/axiosInstance';
export default class ProctoringTracker {
    constructor(attemptId, onViolation) {
        this.attemptId = attemptId;
        this.onViolation = onViolation;
        this.logsBuffer = [];
        this.syncIntervalMs = 10000; 
        this.timerId = null;

        this.initListeners();
        this.startSyncing();
        
        console.log("Proctoring started for attempt:", this.attemptId);
    }

    logEvent(eventType, description) {
        const logEntry = {
            timestamp: new Date().toISOString(), 
            eventType: eventType,
            description: description
        };
        this.logsBuffer.push(logEntry);
        console.warn("Proctoring Alert:", logEntry);

        if (this.onViolation) {
            this.onViolation(eventType, description);
        }
    }

    initListeners() {
        this.handleVisibilityChange = () => {
            if (document.hidden) {
                this.logEvent("TAB_SWITCH", "Кандидат перейшов на іншу вкладку або згорнув браузер");
            }
        };

        this.handleBlur = () => {
            this.logEvent("WINDOW_BLUR", "Вікно браузера втратило фокус");
        };

        this.handleCopy = () => {
            this.logEvent("COPY_ATTEMPT", "Кандидат скопіював текст на сторінці тесту");
        };

        this.handlePaste = () => {
            this.logEvent("PASTE_ATTEMPT", "Кандидат вставив текст із буфера обміну");
        };

        this.handleOffline = () => {
            this.logEvent("CONNECTION_LOST", "Зникло з'єднання з інтернетом");
        };

        document.addEventListener("visibilitychange", this.handleVisibilityChange);
        window.addEventListener("blur", this.handleBlur);
        document.addEventListener("copy", this.handleCopy);
        document.addEventListener("paste", this.handlePaste);
        window.addEventListener("offline", this.handleOffline);
    }

    async sendLogsToServer() {
        if (this.logsBuffer.length === 0) return;

        const logsToSend = [...this.logsBuffer];
        this.logsBuffer = [];

        try {
            await axiosInstance.post(`/attempts/${this.attemptId}/logs`, logsToSend)
            console.log("Proctoring logs synced:", logsToSend.length);
        } catch (error) {
            console.error("Proctoring sync failed, returning logs to buffer");
            this.logsBuffer = [...logsToSend, ...this.logsBuffer];
        }
    }

    startSyncing() {
        this.timerId = setInterval(() => {
            this.sendLogsToServer();
        }, this.syncIntervalMs);
    }

    stop() {
        clearInterval(this.timerId);
        
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        window.removeEventListener("blur", this.handleBlur);
        document.removeEventListener("copy", this.handleCopy);
        document.removeEventListener("paste", this.handlePaste);
        window.removeEventListener("offline", this.handleOffline);

        this.sendLogsToServer();
        console.log("Proctoring stopped");
    }
}