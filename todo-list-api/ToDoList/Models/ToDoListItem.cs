using System.Diagnostics.CodeAnalysis;

namespace ToDoList.Models;

public class ToDoListItem
{
    public ToDoListItem() { }

    [SetsRequiredMembers]
    public ToDoListItem(CreateToDoListItemModel model)
    {
        Id = Guid.NewGuid();
        ToDoTask = model.ToDoTask;
        Deadline = model.Deadline;
        IsCompleted = model.IsCompleted;
        TaskDetails = model.TaskDetails;
        ParentToDoListItemId = model.ParentToDoListItemId;
    }

    public Guid Id { get; set; }
    public required string ToDoTask { get; set; }
    public DateTime Deadline { get; set; }
    public bool IsCompleted { get; set; }
    public string? TaskDetails { get; set; }
    public Guid? ParentToDoListItemId { get; set; }
}