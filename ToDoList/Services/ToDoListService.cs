using ToDoList.Models;
using ToDoList.Repositories;

namespace ToDoList.Services;

public class ToDoListService : IToDoListService
{
    private readonly IToDoListRepository _toDoListRepository;
    private readonly ILogger<ToDoListService> _logger;

    public ToDoListService(IToDoListRepository toDoListRepository, ILogger<ToDoListService> logger)
    {
        _toDoListRepository = toDoListRepository;
        _logger = logger;
    }
    
    public Task<IEnumerable<ToDoListItem>> GetToDoListItems()
    {
        return _toDoListRepository.GetToDoListItems();
    }

    public Task<bool> AddToDoListItem(ToDoListItem item)
    {
        return _toDoListRepository.AddToDoListItem(item);
    }
}