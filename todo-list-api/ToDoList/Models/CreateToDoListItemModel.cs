namespace ToDoList.Models
{
    public class CreateToDoListItemModel
    {
        public required string ToDoTask { get; set; }
        public DateTime Deadline { get; set; }
        public bool IsCompleted { get; set; }
        public string? TaskDetails { get; set; }
        public string? ParentToDoListItemId { get; set; }
    }
}
