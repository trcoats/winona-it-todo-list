using Microsoft.EntityFrameworkCore;
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

    public async Task<bool> RemoveToDoListItem(ToDoListItem item)
    {
        throw new NotImplementedException();
    }
}