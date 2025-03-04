<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
            color: #333;
        }

        h1 {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            margin: 0;
        }

        h2 {
            margin-top: 30px;
            text-align: center;
            color: #4CAF50;
        }

        #title, #status {
            padding: 10px;
            width: 250px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        #status {
            width: 270px;
        }

        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #45a049;
        }

        #taskList {
            list-style-type: none;
            padding: 0;
            max-width: 400px;
            margin: 30px auto;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        #taskList li {
            padding: 15px;
            border-bottom: 1px solid #f1f1f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #taskList li:last-child {
            border-bottom: none;
        }

        .deleteButton {
            background-color: #f44336;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .deleteButton:hover {
            background-color: #e53935;
        }

        .task-status {
            font-weight: bold;
        }

        .task-status.pending {
            color: #ff9800;
        }

        .task-status.in-progress {
            color: #2196F3;
        }

        .task-status.completed {
            color: #4CAF50;
        }
    </style>
</head>
<body>
    <h1>Task Manager</h1>
    <h2>Create Task</h2>
    <div style="text-align: center;">
        <input type="text" id="title" placeholder="Task Title">
        <select id="status">
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>
        <button onclick="createTask()">Create Task</button>
    </div>

    <h2>Tasks</h2>
    <ul id="taskList"></ul>

    <script>
        const apiUrl = '/tasks';

        const fetchTasks = async () => {
            const response = await fetch(apiUrl);
            const tasks = await response.json();
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                const taskStatus = document.createElement('span');
                taskStatus.classList.add('task-status', task.status);
                taskStatus.textContent = task.status.charAt(0).toUpperCase() + task.status.slice(1);
                
                li.textContent = `${task.title} `;
                li.appendChild(taskStatus);
                li.appendChild(createDeleteButton(task.id));
                taskList.appendChild(li);
            });
        };

        const createDeleteButton = (id) => {
            const button = document.createElement('button');
            button.textContent = 'Delete';
            button.classList.add('deleteButton');
            button.onclick = () => deleteTask(id);
            return button;
        };

        const createTask = async () => {
            const title = document.getElementById('title').value;
            const status = document.getElementById('status').value;
            if (!title || !status) {
                alert("Please enter a task title and select a status.");
                return;
            }
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, status })
            });
            if (response.ok) {
                await fetchTasks();
                document.getElementById('title').value = '';
                document.getElementById('status').value = '';
            } else {
                const error = await response.json();
                alert(error.error);
            }
        };

        const deleteTask = async (id) => {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                await fetchTasks();
            } else {
                const error = await response.json();
                alert(error.error);
            }
        };

        // Initial fetch of tasks
        fetchTasks();
    </script>
</body>
</html>
