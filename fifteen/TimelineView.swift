import SwiftUI

struct TimelineView: View {
    @ObservedObject var dataManager: DataManager
    @State private var selectedDate = Date()
    @State private var showingDatePicker = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header with date picker
                HStack {
                    Button(action: {
                        showingDatePicker = true
                    }) {
                        HStack {
                                                Text(dateFormatter.string(from: selectedDate))
                        .font(.appHeadline)
                        .foregroundColor(.primary)
                            
                            Image(systemName: "calendar")
                                .foregroundColor(.blue)
                        }
                    }
                    
                    Spacer()
                    
                    if let currentDay = dataManager.currentDay {
                        Text("\(currentDay.timeBlocks.filter { $0.isCompleted }.count)/\(currentDay.timeBlocks.count)")
                            .font(.appCaption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding()
                .background(Color.primary.opacity(0.05))
                
                if let currentDay = dataManager.currentDay {
                    // Daily Summary
                    DailySummaryView(dayData: currentDay)
                        .padding(.top)
                    
                    // Timeline
                    ScrollView {
                        LazyVStack(spacing: 8) {
                            ForEach(currentDay.timeBlocks) { timeBlock in
                                TimeBlockView(
                                    timeBlock: timeBlock,
                                    onActivitySelected: { activity in
                                        dataManager.setActivity(for: timeBlock.id, activity: activity)
                                    },
                                    onSameAsPrevious: {
                                        dataManager.setSameAsPrevious(for: timeBlock.id)
                                    }
                                )
                            }
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 100) // Extra space for scrolling
                    }
                } else {
                    // No data available
                    VStack(spacing: 16) {
                        Spacer()
                        
                        Image(systemName: "clock.badge.questionmark")
                            .font(.system(size: 60))
                            .foregroundColor(.secondary)
                        
                        Text("No timeline available")
                            .font(.appHeadline)
                            .foregroundColor(.primary)
                        
                        Text("Please set your wake and sleep times")
                            .font(.appCaption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                        
                        Spacer()
                    }
                    .padding()
                }
            }
            .navigationTitle("Timeline")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .sheet(isPresented: $showingDatePicker) {
                DatePickerView(
                    selectedDate: $selectedDate,
                    onDateSelected: { date in
                        selectedDate = date
                        dataManager.loadDay(for: date)
                        showingDatePicker = false
                    }
                )
                .presentationDetents([.height(300)])
            }
            .onAppear {
                dataManager.loadDay(for: selectedDate)
            }
        }
    }
    
    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter
    }
}

struct DatePickerView: View {
    @Binding var selectedDate: Date
    let onDateSelected: (Date) -> Void
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Select Date")
                .font(.appHeadline)
                .padding(.top)
            
            DatePicker(
                "Date",
                selection: $selectedDate,
                displayedComponents: .date
            )
            #if os(iOS)
            .datePickerStyle(WheelDatePickerStyle())
            #endif
            .labelsHidden()
            
            HStack(spacing: 16) {
                Button("Cancel") {
                    dismiss()
                }
                .font(.appButtonSmall)
                .buttonStyle(.bordered)
                
                Button("Select") {
                    onDateSelected(selectedDate)
                }
                .font(.appButtonSmall)
                .buttonStyle(.borderedProminent)
            }
            
            Spacer()
        }
        .padding()
    }
}
