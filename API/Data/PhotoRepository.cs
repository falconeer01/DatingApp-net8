using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class PhotoRepository(DataContext context) : IPhotoRepository
{
    public async Task<Photo?> GetPhotoById(int id)
    {
        return await context.Photos
        .IgnoreQueryFilters()
        .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.Photos
            .IgnoreQueryFilters()
            .Where(p => p.IsApproved != true)
            .Select(x => new PhotoForApprovalDto
            {
                Id = x.Id,
                Username = x.AppUser.UserName,
                Url = x.Url,
                IsApproved = x.IsApproved
            })
            .ToListAsync();
    }

    public void RemovePhoto(Photo photo)
    {
        context.Photos.Remove(photo);
    }
}
