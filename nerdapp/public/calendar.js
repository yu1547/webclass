let unscheduledSubjectsList = [];

const tests = [
    {
        name: "期末考",
        date: new Date("2024-1-1"),
        importance: 6,
        subject: [
            { name: "數學", clock: 4, finish: 0 },
            { name: "物理", clock: 3, finish: 0 }
        ],
        finish: 0,
        total: 0
    },
    {
        name: "微積分小考",
        date: new Date("2024-1-31"),
        importance: 2,
        subject: [
            { name: "微積分", clock: 13, finish: 0 },
        ],
        finish: 0,
        total: 0
    }
];

let resultList = [];


const FreeTime = [
{
    day: "Monday",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
},
{
    day: "Tuesday",
    startTime: "02:00 PM",
    endTime: "05:00 PM",
},
{
    day: "Wednesday",
    startTime: "10:00 AM",
    endTime: "01:00 PM",
},
// Add more time slots for other days as needed
]

// 函數：檢查某個時間是否在使用者的空閒時間範圍內
function isTimeInUserFreeSlot(freeTimeArray, day, time) {
const dayTimeSlots = freeTimeArray.find((slot) => slot.day === day);

if (dayTimeSlots) {
    const startTime = new Date(`1970-01-01 ${dayTimeSlots.startTime}`);
    const endTime = new Date(`1970-01-01 ${dayTimeSlots.endTime}`);
    const checkTime = new Date(`1970-01-01 ${time}`);

    return checkTime >= startTime && checkTime <= endTime;
}

return false;
}

// 函數：檢查指定的日期是否在使用者的空閒時間範圍內
function isDayInFreeTime(day, freeTimeArray) {
const dayTimeSlots = freeTimeArray.find((slot) => slot.day === day);
return !!dayTimeSlots;
}

function calculateWeight(exam, currentDate) {
const daysDifference = Math.ceil((exam.date - currentDate) / (1000 * 60 * 60 * 24));
return daysDifference === 0 ? 10 : exam.importance / daysDifference;
}

function findAvailableTime(currentDate) {
return 60;
}

function findBestSubject(tests) {
return tests[0];
}

const ToDoListElement = document.getElementById("ToDoList");

const currentDate = new Date();
const tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);

function resetSchedule() {
ToDoListElement.innerHTML = "";
unscheduledSubjectsList = [];

while (tests.length > 0) {
    let availableTime = findAvailableTime(tomorrow);

    if (availableTime >= 25) {
        const selectedItem = findBestSubject(tests);

        // 檢查日期是否在使用者的空閒時間
        const isDayFree = isDayInFreeTime(selectedItem.date.toLocaleDateString('en-US', { weekday: 'long' }), FreeTime);

        if (isDayFree) {
            const todoItem = {
                name: selectedItem.name,
                date: new Date(tomorrow),
                importance: selectedItem.importance,
                subject: selectedItem.subject[0].name,
                clock: selectedItem.subject[0].clock,
                finish: 0,
                weight: calculateWeight(selectedItem, currentDate)
            };

            selectedItem.subject[0].clock -= 1;
            if (selectedItem.subject[0].clock === 0) {
                tests.splice(tests.indexOf(selectedItem), 1);
            }

            availableTime -= 25;

            resultList.push(todoItem);
            tomorrow.setMinutes(tomorrow.getMinutes() + 25);

            if (resultList.length % 3 === 0) {
                const breakElement = document.createElement("br");
                ToDoListElement.appendChild(breakElement);
            }
        } else {
            // 若日期不在空閒時間內，將科目添加到未能安排的科目列表
            const unscheduledSubject = tests.shift();
            unscheduledSubjectsList.push(unscheduledSubject);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0);
        }
    } else {
        // 若無法安排，將科目添加到未能安排的科目列表
        const unscheduledSubject = tests.shift();
        unscheduledSubjectsList.push(unscheduledSubject);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0);
    }
}

resultList = resultList.filter(item => item.date >= currentDate);

resultList.forEach(item => {
    const minutes = item.date.getMinutes().toString().padStart(2, '0');
    const hours = item.date.getHours().toString().padStart(2, '0');
    const listItem = document.createElement("li");
    listItem.className = "schedule-item";
    listItem.innerHTML = `
            <strong>${item.name}</strong><br>
            Date: ${item.date.toLocaleDateString()}<br>
            Time: ${hours}:${minutes}<br>
            Subject: ${item.subject} (剩下${item.clock}&#127813)<br>
            <label class="checkbox-label">
                <input type="checkbox"> Finish
            </label>
            <br>
        `;
    ToDoListElement.appendChild(listItem);
});

checkUnscheduledSubjects();
}

function checkUnscheduledSubjects() {
const unscheduledSubjectsString = unscheduledSubjectsList
    .map(subject => `${subject.name} (剩餘${subject.subject[0].clock}小時)`)
    .join(", ");

if (unscheduledSubjectsString) {
    window.alert(`以下科目未能排入日程表: ${unscheduledSubjectsString}`);
}
}

// 初始化頁面時執行一次
resetSchedule();
