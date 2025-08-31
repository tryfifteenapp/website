import SwiftUI

struct SetupView: View {
    @ObservedObject var dataManager: DataManager
    @State private var wakeTime = Calendar.current.date(from: DateComponents(hour: 7, minute: 0)) ?? Date()
    @State private var sleepTime = Calendar.current.date(from: DateComponents(hour: 23, minute: 0)) ?? Date()
    @State private var showingAlert = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                // App Icon and Title
                VStack(spacing: 16) {
                    Image(systemName: "clock.fill")
                        .font(.system(size: 60))
                        .foregroundColor(.blue)
                    
                    Text("fifteen")
                        .font(.appTitle)
                    
                    Text("Document your day in 15-minute increments")
                        .font(.appCaption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                Spacer()
                
                // Time Selection
                VStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("When do you wake up?")
                            .font(.appHeadline)
                            .foregroundColor(.primary)
                        
                        DatePicker("Wake Time", selection: $wakeTime, displayedComponents: .hourAndMinute)
                            #if os(iOS)
                            .datePickerStyle(WheelDatePickerStyle())
                            #endif
                            .labelsHidden()
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("When do you go to sleep?")
                            .font(.appHeadline)
                            .foregroundColor(.primary)
                        
                        DatePicker("Sleep Time", selection: $sleepTime, displayedComponents: .hourAndMinute)
                            #if os(iOS)
                            .datePickerStyle(WheelDatePickerStyle())
                            #endif
                            .labelsHidden()
                    }
                }
                .padding(.horizontal)
                
                Spacer()
                
                // Get Started Button
                Button(action: {
                    if wakeTime < sleepTime {
                        dataManager.setWakeTime(wakeTime)
                        dataManager.setSleepTime(sleepTime)
                    } else {
                        showingAlert = true
                    }
                }) {
                    Text("Get Started")
                        .font(.appButton)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(12)
                }
                .padding(.horizontal)
                .alert("Invalid Times", isPresented: $showingAlert) {
                    Button("OK") { }
                } message: {
                    Text("Wake time must be before sleep time.")
                }
                
                // Preview
                VStack(spacing: 12) {
                    Text("Preview of your day:")
                        .font(.appCaption)
                        .foregroundColor(.secondary)
                    
                    let previewBlocks = generatePreviewBlocks(wakeTime: wakeTime, sleepTime: sleepTime)
                    Text("\(previewBlocks.count) time blocks")
                        .font(.appSmall)
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            #if os(iOS)
        .navigationBarHidden(true)
        #endif
        }
    }
    
    private func generatePreviewBlocks(wakeTime: Date, sleepTime: Date) -> [TimeBlock] {
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
        
        return blocks
    }
}
