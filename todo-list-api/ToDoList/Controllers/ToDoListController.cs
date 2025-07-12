using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Models;
using ToDoList.Services;

namespace ToDoList.Controllers;

[ApiController]
[Route("[controller]")]
public class ToDoListController(IToDoListService toDoListService, ILogger<ToDoListController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetToDoListItems()
    {
        try
        {
            return Ok(await toDoListService.GetToDoListItems());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An exception occurred while making a GET request on endpoint /");
            return StatusCode(500);
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddToDoListItem([FromBody] CreateToDoListItemModel item)
    {
        try
        {
            var newId = await toDoListService.AddToDoListItem(item);
            return Ok(newId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An exception occurred while making a POST request on endpoint /");
            return StatusCode(500);
        }
    }

    [HttpPatch("complete/{id}")]
    public async Task<IActionResult> MarkToDoItemCompleted(Guid id)
    {
        try
        {
            await toDoListService.MarkToDoListItemCompleted(id);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An exception occurred while making a PATCH request on endpoint /complete with id {id}", id);
            return StatusCode(500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteToDoListItem(Guid id) {
        try
        {
            await toDoListService.DeleteToDoListItemById(id);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An exception occurred while making a DELETE request on endpoint / with id {id}", id);
            return StatusCode(500);
        }
    }
}