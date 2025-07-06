using ToDoList.Models;

namespace ToDoList.Repositories;

public interface IToDoListRepository
{
    public Task<IEnumerable<ToDoListItem>> GetToDoListItems();
    public Task<ToDoListItem?> GetToDoListItemById(Guid id);
    public Task<bool> AddToDoListItem(ToDoListItem item);
    public Task<bool> UpdateToDoListItem(ToDoListItem item);
    public Task<bool> DeleteToDoListItem(ToDoListItem item);
}