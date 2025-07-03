using ToDoList.Models;

namespace ToDoList.Repositories;

public interface IToDoListRepository
{
    public Task<IEnumerable<ToDoListItem>> GetToDoListItems();
    public Task<bool> AddToDoListItem(ToDoListItem item);
    public Task<bool> RemoveToDoListItem(ToDoListItem item);
}