using ToDoList.Models;

namespace ToDoList.Services;

public interface IToDoListService
{
    public Task<IEnumerable<ToDoListItem>> GetToDoListItems();
    public Task<bool> AddToDoListItem(ToDoListItem item);
}