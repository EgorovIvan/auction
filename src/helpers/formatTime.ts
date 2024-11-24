// Функция для форматирования времени в формате "MM:SS"
export const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${padZero(minutes)}:${padZero(seconds)}`;
};

// Функция для добавления ведущего нуля к числу меньше 10
const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

// Функция для преобразования строки "MM:SS" в секунды
export const parseTime = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
};
