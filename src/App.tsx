import { FC, Fragment, useMemo, useState } from "react";
import "./App.css";
import data from "./data.json";

interface TaskIF {
  id: number | string;
  task: string;
  start_time: string;
  end_time: string;
  max_score: number;
  obtained_score: number;
  date: number;
}

interface TaskGroupIF {
  heading: string;
  progress: number;
  data: TasksIF;
}

type TasksIF = TaskIF[];

type TaskGroupsIF = TaskGroupIF[];

const TasksTable: FC<{ tasks: TasksIF }> = ({ tasks }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Task</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="table-row">
            <td>{new Date(task.date).toLocaleDateString()}</td>
            <td>{task.task}</td>
            <td>{task.start_time}</td>
            <td>{task.end_time}</td>
            <td className="score-container">
              <div className="progress-circle">
                <svg
                  className="progress-svg"
                  width="64"
                  height="64"
                  viewBox="0 0 100 100"
                >
                  <circle className="progress-bg" cx="50" cy="50" r="40" />
                  <circle
                    className="progress-bar"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      251.2 - (task.obtained_score / task.max_score) * 251.2
                    }
                  />
                </svg>
                <span className="progress-text">
                  {((task.obtained_score / task.max_score) * 100).toFixed(0)}%
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const GroupTable: FC<{ taskGroups: TaskGroupsIF }> = ({ taskGroups }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Period</th>
          <th>No. Of Tasks</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {taskGroups.map((group) => (
          <Fragment key={group.heading}>
            <tr>
              <td>{group.heading}</td>
              <td>{group.data.length}</td>
              <td className="score-container">
                <div className="progress-circle">
                  <svg
                    className="progress-svg"
                    width="64"
                    height="64"
                    viewBox="0 0 100 100"
                  >
                    <circle className="progress-bg" cx="50" cy="50" r="40" />
                    <circle
                      className="progress-bar"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (group.progress / 100) * 251.2}
                    />
                  </svg>
                  <span className="progress-text">
                    {((group.progress / 100) * 100).toFixed(0)}%
                  </span>
                </div>
              </td>
            </tr>
            {/* <tr>
              <td colSpan={3}>
                <TasksTable tasks={group.data} />
              </td>
            </tr> */}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

function App() {
  const [view, setView] = useState("BY_TASK");
  const tasks: TasksIF | TaskGroupsIF = useMemo(() => {
    const groupTasksByView: (tasks: TasksIF, view: string) => any = (
      tasks,
      view
    ) => {
      const grouped: Record<string, { data: TaskIF[]; totalScore: number; maxScore: number }> = {};

      tasks.forEach((task) => {
        const date = new Date(task.date);
        let key:string;

        switch (view) {
          case "DAILY":
            key = date.toISOString().split("T")[0]; // YYYY-MM-DD
            break;
          case "WEEKLY":
            key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`; // YYYY-WX
            break;
          case "MONTHLY":
            key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M
            break;
          case "QUARTERLY":
            key = `${date.getFullYear()}-Q${Math.ceil(
              (date.getMonth() + 1) / 3
            )}`; // YYYY-QX
            break;
          case "YEARLY":
          default:
            key = `${date.getFullYear()}`; // YYYY
        }

        if (!grouped[key]) {
          grouped[key] = { data: [], totalScore: 0, maxScore: 0 };
        }

        grouped[key].data.push(task);
        grouped[key].totalScore += task.obtained_score;
        grouped[key].maxScore += task.max_score;
      });

      return Object.entries(grouped).map(([key, group]) => ({
        heading: key,
        progress: group.maxScore
          ? Math.round((group.totalScore / group.maxScore) * 100)
          : 0,
        data: group.data,
      }));
    };

    return view === "BY_TASK" ? data : groupTasksByView(data, view);
  }, [data, view]);


  console.log(tasks);

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* Theme Selector */}
        <div className="theme-selector">
          <select
            className="theme-dropdown"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="BY_TASK">By Task</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          <select className="theme-dropdown">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Table Container */}
        <div className="table-container">
          {view === "BY_TASK" ? (
            <TasksTable tasks={tasks as TasksIF} />
          ) : (
            <GroupTable taskGroups={tasks as TaskGroupsIF} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

/*
Auth

Dashboard

today's tasks (main screen)

add task butotn (Floating)

*/
