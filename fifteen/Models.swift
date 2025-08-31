import Foundation

enum ActivityType: String, CaseIterable, Codable {
    case productive = "productive"
    case life = "life"
    case unproductive = "unproductive"
    
    var color: String {
        switch self {
        case .productive:
            return "ProductiveColor"
        case .life:
            return "LifeColor"
        case .unproductive:
            return "UnproductiveColor"
        }
    }
    
    var displayName: String {
        switch self {
        case .productive:
            return "Productive"
        case .life:
            return "Life"
        case .unproductive:
            return "Unproductive"
        }
    }
}

struct TimeBlock: Identifiable, Codable {
    var id = UUID()
    let startTime: Date
    let endTime: Date
    var activity: ActivityType?
    
    var timeRange: String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return "\(formatter.string(from: startTime))–\(formatter.string(from: endTime))"
    }
    
    var isCompleted: Bool {
        return activity != nil
    }
}

struct DayData: Identifiable, Codable {
    var id = UUID()
    let date: Date
    let wakeTime: Date
    let sleepTime: Date
    var timeBlocks: [TimeBlock]
    
    var productivePercentage: Double {
        let productiveBlocks = timeBlocks.filter { $0.activity == .productive }.count
        return timeBlocks.isEmpty ? 0 : Double(productiveBlocks) / Double(timeBlocks.count) * 100
    }
    
    var lifePercentage: Double {
        let lifeBlocks = timeBlocks.filter { $0.activity == .life }.count
        return timeBlocks.isEmpty ? 0 : Double(lifeBlocks) / Double(timeBlocks.count) * 100
    }
    
    var unproductivePercentage: Double {
        let unproductiveBlocks = timeBlocks.filter { $0.activity == .unproductive }.count
        return timeBlocks.isEmpty ? 0 : Double(unproductiveBlocks) / Double(timeBlocks.count) * 100
    }
}
