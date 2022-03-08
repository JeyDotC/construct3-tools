import { br, button, div, h5, sideEffect, state } from "../../public/justjs/index.js";
import { TaskList } from "./TaskList.js";


function TasksDrawer() {

  const [getTaskList, setTaskList, subscribeToTaskList] = state({});

  const handleRemoveCompletedTasks = () => setTaskList(Object.entries(getTaskList()).filter(([, task]) => {
    const { size, totalProgress } = task as { size: number, totalProgress: number };
    return (size / totalProgress) < 1;
  }).reduce((accumulate, [task, status]) => ({ ...accumulate, [task]: status }), {}));

  // @ts-ignore
  window.electronAPI.onTasksStarted((event, tasks) => setTaskList({ ...getTaskList(), ...tasks }));
  //@ts-ignore
  window.electronAPI.onTaskProgress((event, { task, totalProgress }) => setTaskList({ ...getTaskList(), [task]: { ...getTaskList()[task], totalProgress } }));

  const offCanvasRef = (): { show: Function } | null => {

    const element = document.getElementById("runningTasks");

    if (!element) {
      return null;
    }

    // @ts-ignore
    return bootstrap.Offcanvas.getOrCreateInstance(element);
  }

  return (
    div({},
      div({ class: "text-end fixed-bottom" },
        button({
          class: "btn btn-sm",
          type: "button",
          data: {
            bsToggle: "offcanvas",
            bsTarget: "#runningTasks"
          }
        },
          "Tasks"
        )
      ),
      div({ class: "offcanvas offcanvas-bottom", tabindex: "-1", id: "runningTasks" },
        div({ class: "offcanvas-header" },
          h5({ class: "offcanvas-title" },
            "Running Tasks", br(),
            button({ class: "btn btn-link btn-sm", onClick: handleRemoveCompletedTasks }, "Remove Completed Tasks")),
            button({ type: "button", class: "btn btn-sm", data: { bsDismiss: "offcanvas" } }, "Tasks"),
        ),
        div({ class: "offcanvas-body" },
          sideEffect(
            (tasks) => {
              offCanvasRef()?.show();
              return TaskList({ tasks })
            },
            subscribeToTaskList
          )
        )
      )
    )
  );
}

export { TasksDrawer };