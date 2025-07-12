using Microsoft.EntityFrameworkCore;
using ToDoList.Data;
using ToDoList.Models;

namespace ToDoList.Repositories;

public class ToDoListRepository(ToDoListInMemoryDbContext dbContext, ILogger<ToDoListRepository> logger) : IToDoListRepository
{
    public async Task<IEnumerable<ToDoListItem>> GetToDoListItems()
    {
        var trace = $"{nameof(ToDoListRepository)}.{nameof(GetToDoListItems)}";

        try
        {
            return await dbContext.ToDoItems.ToListAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{trace} - An error occurred while attempting to retrieve to do list items", trace);
            throw;
        }
    }

    public async Task<ToDoListItem?> GetToDoListItemById(Guid id)
    {
        var trace = $"{nameof(ToDoListRepository)}.{nameof(GetToDoListItemById)}";

        try
        {
            var toDoListItem = await dbContext.ToDoItems.FindAsync(id);

            if (toDoListItem == null)
                throw new Exception($"To Do List Item with id {id} not found");

            return toDoListItem;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{trace} - An error occurred while attempting to retrieve with id {id}", trace, id);
            return null;
        }
    }

    public async Task<bool> AddToDoListItem(ToDoListItem item)
    {
        var trace = $"{nameof(ToDoListRepository)}.{nameof(AddToDoListItem)}";

        try
        {
            await dbContext.ToDoItems.AddAsync(item);
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{trace} - An error occurred while attempting to add new ToDo List Item", trace);
            return false;
        }
    }

    public async Task<bool> UpdateToDoListItem(ToDoListItem item)
    {
        var trace = $"{nameof(ToDoListRepository)}.{nameof(UpdateToDoListItem)}";

        try
        {
            dbContext.Update(item);
            await dbContext.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{trace} - An error occurred while attempting to update item with id {id}", trace, item.Id);
            return false;
        }
    }

    public async Task<bool> DeleteToDoListItem(ToDoListItem item)
    {
        var trace = $"{nameof(ToDoListRepository)}.{nameof(DeleteToDoListItem)}";

        try
        {
            dbContext.Remove(item);
            await dbContext.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{trace} - An error occurred while attempting to delete item with id {id}", trace, item.Id);
            return false;
        }
    }
}