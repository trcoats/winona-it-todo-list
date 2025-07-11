using Microsoft.AspNetCore.Mvc;
using ToDoList.Models;
using ToDoList.Services;

namespace ToDoList.Controllers;

[ApiController]
[Route("[controller]")]
public class ToDoListController : ControllerBase
{
    private readonly IToDoListService _toDoListService;

    public ToDoListController(IToDoListService toDoListService)
    {
        _toDoListService = toDoListService;
    }

    [HttpGet]
    public async Task<IActionResult> GetToDoListItems()
    {
        return Ok(await _toDoListService.GetToDoListItems());
    }

    [HttpPost]
    public async Task<IActionResult> AddToDoListItem([FromBody] CreateToDoListItemModel item)
    {
        var newId = await _toDoListService.AddToDoListItem(item);
        return Ok(newId);
    }

    [HttpPatch("complete/{id}")]
    public async Task<IActionResult> MarkToDoItemCompleted(Guid id)
    {
        await _toDoListService.MarkToDoListItemCompleted(id);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteToDoListItem(Guid id) {
        await _toDoListService.DeleteToDoListItemById(id);
        return Ok();
    }
}