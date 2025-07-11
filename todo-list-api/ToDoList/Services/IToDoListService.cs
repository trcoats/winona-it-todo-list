using ToDoList.Models;

namespace ToDoList.Services;

public interface IToDoListService
{
    public Task<IEnumerable<ToDoListItem>> GetToDoListItems();
    public Task<string> AddToDoListItem(CreateToDoListItemModel item);
    public Task<bool> DeleteToDoListItemById(Guid id);
    public Task<bool> MarkToDoListItemCompleted(Guid id);
}