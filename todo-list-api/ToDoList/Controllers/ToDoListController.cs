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
    public IActionResult AddToDoListItem([FromBody] CreateToDoListItemModel item)
    {
        _toDoListService.AddToDoListItem(item);
        return Ok();
    }

    [HttpPatch("complete/{id}")]
    public IActionResult MarkToDoItemCompleted(Guid id)
    {
        _toDoListService.MarkToDoListItemCompleted(id);
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteToDoListItem(Guid id) {
        _toDoListService.DeleteToDoListItemById(id);
        return Ok();
    }
}