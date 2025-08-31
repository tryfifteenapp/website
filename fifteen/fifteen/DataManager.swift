import Foundation

class DataManager: ObservableObject {
    @Published var currentDay: DayData?
    @Published var savedDays: [DayData] = []
    
    private let userDefaults = UserDefaults.standard
    private let savedDaysKey = "SavedDays"
    private let wakeTimeKey = "WakeTime"
    private let sleepTimeKey = "SleepTime"
    
    init() {
        loadSavedDays()
        loadCurrentDay()
    }
    
    // MARK: - Wake/Sleep Time Management
    
    func setWakeTime(_ time: Date) {
        userDefaults.set(time, forKey: wakeTimeKey)
        if let sleepTime = getSleepTime() {
            generateTimeBlocks(wakeTime: time, sleepTime: sleepTime)
        }
    }
    
    func setSleepTime(_ time: Date) {
        userDefaults.set(time, forKey: sleepTimeKey)
        if let wakeTime = getWakeTime() {
            generateTimeBlocks(wakeTime: wakeTime, sleepTime: time)
        }
    }
    
    func getWakeTime() -> Date? {
        return userDefaults.object(forKey: wakeTimeKey) as? Date
    }
    
    func getSleepTime() -> Date? {
        return userDefaults.object(forKey: sleepTimeKey) as? Date
    }
    
    // MARK: - Time Block Generation
    
    private func generateTimeBlocks(wakeTime: Date, sleepTime: Date) {
        let calendar = Calendar.current
        let fifteenMinutes: TimeInterval = 15 * 60
        
        var blocks: [TimeBlock] = []
        var currentTime = wakeTime
        
        while currentTime < sleepTime {
            let endTime = currentTime.addingTimeInterval(fifteenMinutes)
            if endTime <= sleepTime {
                let block = TimeBlock(startTime: currentTime, endTime: endTime, activity: nil)
                blocks.append(block)
            }
            currentTime = endTime
        }
        
        let today = calendar.startOfDay(for: Date())
        currentDay = DayData(date: today, wakeTime: wakeTime, sleepTime: sleepTime, timeBlocks: blocks)
        saveCurrentDay()
    }
    
    // MARK: - Activity Management
    
    func setActivity(for blockId: UUID, activity: ActivityType) {
        guard var day = currentDay else { return }
        
        if let index = day.timeBlocks.firstIndex(where: { $0.id == blockId }) {
            day.timeBlocks[index].activity = activity
            currentDay = day
            saveCurrentDay()
        }
    }
    
    func setSameAsPrevious(for blockId: UUID) {
        guard var day = currentDay else { return }
        
        if let index = day.timeBlocks.firstIndex(where: { $0.id == blockId }) {
            if index > 0 {
                let previousActivity = day.timeBlocks[index - 1].activity
                day.timeBlocks[index].activity = previousActivity
                currentDay = day
                saveCurrentDay()
            }
        }
    }
    
    // MARK: - Data Persistence
    
    private func saveCurrentDay() {
        guard let day = currentDay else { return }
        
        // Save to saved days
        if let existingIndex = savedDays.firstIndex(where: { Calendar.current.isDate($0.date, inSameDayAs: day.date) }) {
            savedDays[existingIndex] = day
        } else {
            savedDays.append(day)
        }
        
        saveSavedDays()
    }
    
    private func saveSavedDays() {
        if let encoded = try? JSONEncoder().encode(savedDays) {
            userDefaults.set(encoded, forKey: savedDaysKey)
        }
    }
    
    private func loadSavedDays() {
        if let data = userDefaults.data(forKey: savedDaysKey),
           let decoded = try? JSONDecoder().decode([DayData].self, from: data) {
            savedDays = decoded
        }
    }
    
    private func loadCurrentDay() {
        let today = Calendar.current.startOfDay(for: Date())
        if let existingDay = savedDays.first(where: { Calendar.current.isDate($0.date, inSameDayAs: today) }) {
            currentDay = existingDay
        }
    }
    
    // MARK: - Day Navigation
    
    func loadDay(for date: Date) {
        let startOfDay = Calendar.current.startOfDay(for: date)
        if let day = savedDays.first(where: { Calendar.current.isDate($0.date, inSameDayAs: startOfDay) }) {
            currentDay = day
        } else {
            // Generate new day if it doesn't exist
            if let wakeTime = getWakeTime(), let sleepTime = getSleepTime() {
                generateTimeBlocks(wakeTime: wakeTime, sleepTime: sleepTime)
            }
        }
    }
}
