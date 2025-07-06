using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using ToDoList.Data;
using ToDoList.Models;

namespace ToDoList.Repositories;

public class ToDoListRepository : IToDoListRepository
{
    private readonly ToDoListInMemoryDbContext _dbContext;
    
    public ToDoListRepository(ToDoListInMemoryDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<IEnumerable<ToDoListItem>> GetToDoListItems()
    {
        return await _dbContext.ToDoItems.ToListAsync();
    }

    public async Task<ToDoListItem?> GetToDoListItemById(Guid id)
    {
        try
        {
            var toDoListItem = await _dbContext.ToDoItems.FindAsync(id);

            if (toDoListItem == null)
                throw new Exception($"To Do List Item with id {id} not found");

            return toDoListItem;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<bool> AddToDoListItem(ToDoListItem item)
    {
        try
        {
            await _dbContext.ToDoItems.AddAsync(item);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            // Log and such
            return false;
        }
    }

    public async Task<bool> UpdateToDoListItem(ToDoListItem item)
    {
        try
        {
            _dbContext.Update(item);
            await _dbContext.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            return false;
        }
    }

    public async Task<bool> DeleteToDoListItem(ToDoListItem item)
    {
        try
        {
            _dbContext.Remove(item);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            return false;
        }
    }
}