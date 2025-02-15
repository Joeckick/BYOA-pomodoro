// Constants
const TIMER_STATES = {
    WORK: 'work',
    BREAK: 'break',
    PAUSED: 'paused',
    IDLE: 'idle'
};

const TIMES = {
    WORK: 25 * 60,
    BREAK: 5 * 60
};

// State management
class PomodoroTimer {
    constructor() {
        this.timeLeft = TIMES.WORK;
        this.timerInterval = null;
        this.currentState = TIMER_STATES.IDLE;
        this.initializeButtons();
        this.initializeEventListeners();
        this.updateButtonStates(['work', 'break']);
    }

    initializeButtons() {
        this.buttons = {
            work: document.getElementById('workMode'),
            break: document.getElementById('restMode'),
            pauseButton: document.getElementById('pauseButton'),
            reset: document.getElementById('reset')
        };
    }

    initializeEventListeners() {
        this.buttons.work.addEventListener('click', () => this.startWorkMode());
        this.buttons.break.addEventListener('click', () => this.startBreakMode());
        this.buttons.pauseButton.addEventListener('click', () => this.togglePause());
        this.buttons.reset.addEventListener('click', () => this.resetTimer());
    }

    togglePause() {
        if (this.currentState === TIMER_STATES.PAUSED) {
            // If paused, continue
            this.currentState = this.timeLeft > TIMES.BREAK ? TIMER_STATES.WORK : TIMER_STATES.BREAK;
            this.buttons.pauseButton.textContent = 'Pause';
            this.buttons.pauseButton.removeAttribute('data-state');
            this.updateButtonStates(['pauseButton']);
            this.startTimer(this.timeLeft);
        } else {
            // If running, pause
            this.currentState = TIMER_STATES.PAUSED;
            this.buttons.pauseButton.textContent = 'Continue';
            this.buttons.pauseButton.setAttribute('data-state', 'continue');
            clearInterval(this.timerInterval);
            this.updateButtonStates(['pauseButton', 'reset']);
        }
    }

    updateButtonStates(activeButtons = []) {
        Object.values(this.buttons).forEach(button => {
            button.classList.add('inactive');
        });
        activeButtons.forEach(buttonKey => {
            this.buttons[buttonKey].classList.remove('inactive');
        });
    }

    startTimer(duration) {
        this.timeLeft = duration;
        clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.currentState !== TIMER_STATES.PAUSED) {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.handleTimerComplete();
                }
            }
        }, 1000);
    }

    startWorkMode() {
        this.currentState = TIMER_STATES.WORK;
        this.buttons.pauseButton.textContent = 'Pause';
        this.buttons.pauseButton.removeAttribute('data-state');
        this.updateButtonStates(['pauseButton']);
        this.startTimer(TIMES.WORK);
        this.updateStatus('Work Time');
    }

    startBreakMode() {
        this.currentState = TIMER_STATES.BREAK;
        this.buttons.pauseButton.textContent = 'Pause';
        this.buttons.pauseButton.removeAttribute('data-state');
        this.updateButtonStates(['pauseButton']);
        this.startTimer(TIMES.BREAK);
        this.updateStatus('Break Time');
    }

    resetTimer() {
        this.currentState = TIMER_STATES.IDLE;
        clearInterval(this.timerInterval);
        this.timeLeft = TIMES.WORK;
        this.buttons.pauseButton.textContent = 'Pause';
        this.buttons.pauseButton.removeAttribute('data-state');
        this.updateDisplay();
        document.title = 'Pomodoro - 25:00';  // Reset browser tab title with Pomodoro prefix
        this.updateButtonStates(['work', 'break']);
        this.updateStatus('Work Time');
    }

    handleTimerComplete() {
        clearInterval(this.timerInterval);
        this.currentState = TIMER_STATES.IDLE;
        this.updateButtonStates(['work', 'break']);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update timer display
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // Update browser tab title with Pomodoro prefix
        document.title = `Pomodoro - ${timeString}`;
    }

    updateStatus(status) {
        document.getElementById('currentStatus').textContent = status;
    }
}

// Initialize the timer
const pomodoro = new PomodoroTimer();