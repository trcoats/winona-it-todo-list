using ToDoList.Models;
using ToDoList.Repositories;

namespace ToDoList.Services;

public class ToDoListService(IToDoListRepository toDoListRepository, ILogger<ToDoListService> logger) : IToDoListService
{
    public Task<IEnumerable<ToDoListItem>> GetToDoListItems()
    {
        return toDoListRepository.GetToDoListItems();
    }

    public async Task<string> AddToDoListItem(CreateToDoListItemModel item)
    {
        var toDoListItemEntity = new ToDoListItem(item);

        await toDoListRepository.AddToDoListItem(toDoListItemEntity);
        return toDoListItemEntity.Id.ToString();
    }

    public async Task<bool> MarkToDoListItemCompleted(Guid id)
    {
        var allToDoListItems = await toDoListRepository.GetToDoListItems();
        if (allToDoListItems == null || !allToDoListItems.Any())
            return false;

        var toDoListItem = allToDoListItems.FirstOrDefault(x => x.Id == id);

        if (toDoListItem == null)
            return false;

        toDoListItem.IsCompleted = true;
        await toDoListRepository.UpdateToDoListItem(toDoListItem);

        if (toDoListItem.ParentToDoListItemId != null)
        {
            var childrenListItems = allToDoListItems.Where(x => x.ParentToDoListItemId == toDoListItem.ParentToDoListItemId);
            if (childrenListItems.All(x => x.IsCompleted)) {
                var parentListItem = allToDoListItems.FirstOrDefault(x => x.Id == toDoListItem.ParentToDoListItemId);

                if (parentListItem != null)
                {
                    parentListItem.IsCompleted = true;
                    await toDoListRepository.UpdateToDoListItem(parentListItem);
                }

            }
        }

        if (allToDoListItems.Any(x => x.ParentToDoListItemId == id))
        {
            var childrenListItems = allToDoListItems.Where(x => x.ParentToDoListItemId == id);
            foreach(var child in childrenListItems)
            {
                child.IsCompleted = true;
                await toDoListRepository.UpdateToDoListItem(child);
            }
        }

        return true;
    }

    public async Task<bool> DeleteToDoListItemById(Guid id)
    {
        var allToDoListItems = await toDoListRepository.GetToDoListItems();

        if (allToDoListItems == null || !allToDoListItems.Any())
            return false;

        var toDoListItem = allToDoListItems.FirstOrDefault(x => x.Id == id);
        if (toDoListItem == null)
            return false;

        await toDoListRepository.DeleteToDoListItem(toDoListItem);

        var childToDoListItems = allToDoListItems.Where(x => x.ParentToDoListItemId == id);
        if (childToDoListItems != null && childToDoListItems.Any())
        {
            foreach (var childItem in childToDoListItems)
            {
                await toDoListRepository.DeleteToDoListItem(childItem);
            }
        }

        return true;
    }
}