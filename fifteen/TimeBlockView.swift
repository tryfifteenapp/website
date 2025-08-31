import SwiftUI

struct TimeBlockView: View {
    let timeBlock: TimeBlock
    let onActivitySelected: (ActivityType) -> Void
    let onSameAsPrevious: () -> Void
    
    @State private var showingActivityPicker = false
    
    var body: some View {
        Button(action: {
            showingActivityPicker = true
        }) {
            HStack {
                Text(timeBlock.timeRange)
                    .font(.appTime)
                    .foregroundColor(.primary)
                
                Spacer()
                
                if let activity = timeBlock.activity {
                    Circle()
                        .fill(Color(activity.color))
                        .frame(width: 20, height: 20)
                        .overlay(
                            Circle()
                                .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                        )
                } else {
                    Circle()
                        .fill(Color.clear)
                        .frame(width: 20, height: 20)
                        .overlay(
                            Circle()
                                .stroke(Color.primary.opacity(0.3), lineWidth: 1)
                        )
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.primary.opacity(0.05))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.primary.opacity(0.1), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
        .onTapGesture(count: 2) {
            onSameAsPrevious()
        }
        .sheet(isPresented: $showingActivityPicker) {
            ActivityPickerView(
                selectedActivity: timeBlock.activity,
                onActivitySelected: { activity in
                    onActivitySelected(activity)
                    showingActivityPicker = false
                }
            )
            .presentationDetents([.height(200)])
        }
    }
}

struct ActivityPickerView: View {
    let selectedActivity: ActivityType?
    let onActivitySelected: (ActivityType) -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Select Activity")
                .font(.appHeadline)
                .padding(.top)
            
            HStack(spacing: 20) {
                ForEach(ActivityType.allCases, id: \.self) { activity in
                    VStack(spacing: 8) {
                        Circle()
                            .fill(Color(activity.color))
                            .frame(width: 50, height: 50)
                            .overlay(
                                Circle()
                                    .stroke(selectedActivity == activity ? Color.primary : Color.clear, lineWidth: 3)
                            )
                        
                        Text(activity.displayName)
                            .font(.appCaption)
                            .foregroundColor(.primary)
                    }
                    .onTapGesture {
                        onActivitySelected(activity)
                    }
                }
            }
            
            Spacer()
        }
        .padding()
    }
}
