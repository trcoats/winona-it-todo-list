namespace ToDoList.Models;

public class ToDoListItem
{
    public Guid Id { get; set; }
    public string Task { get; set; }
    public DateTime Deadline { get; set; }
    public bool IsCompleted { get; set; }
    public string TaskDetails { get; set; }
}