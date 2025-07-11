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

    public async Task<string> AddToDoListItem(CreateToDoListItemModel item)
    {
        var toDoListItemEntity = new ToDoListItem(item);

        await _toDoListRepository.AddToDoListItem(toDoListItemEntity);
        return toDoListItemEntity.Id.ToString();
    }

    public async Task<bool> MarkToDoListItemCompleted(Guid id)
    {
        var allToDoListItems = await _toDoListRepository.GetToDoListItems();
        if (allToDoListItems == null || !allToDoListItems.Any())
            return false;

        var toDoListItem = allToDoListItems.FirstOrDefault(x => x.Id == id);

        if (toDoListItem == null)
            return false;

        toDoListItem.IsCompleted = true;
        await _toDoListRepository.UpdateToDoListItem(toDoListItem);

        if (toDoListItem.ParentToDoListItemId != null)
        {
            var childrenListItems = allToDoListItems.Where(x => x.ParentToDoListItemId == toDoListItem.ParentToDoListItemId);
            if (childrenListItems.All(x => x.IsCompleted)) {
                var parentListItem = allToDoListItems.FirstOrDefault(x => x.Id == toDoListItem.ParentToDoListItemId);

                if (parentListItem != null)
                {
                    parentListItem.IsCompleted = true;
                    await _toDoListRepository.UpdateToDoListItem(parentListItem);
                }

            }
        }

        return true;
    }

    public async Task<bool> DeleteToDoListItemById(Guid id)
    {
        var allToDoListItems = await _toDoListRepository.GetToDoListItems();

        if (allToDoListItems == null || !allToDoListItems.Any())
            return false;

        var toDoListItem = allToDoListItems.FirstOrDefault(x => x.Id == id);
        if (toDoListItem == null)
            return false;

        await _toDoListRepository.DeleteToDoListItem(toDoListItem);

        var childToDoListItems = allToDoListItems.Where(x => x.ParentToDoListItemId == id);
        if (childToDoListItems != null && childToDoListItems.Any())
        {
            foreach (var childItem in childToDoListItems)
            {
                await _toDoListRepository.DeleteToDoListItem(childItem);
            }
        }

        return true;
    }
}